import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  contentChildren,
  effect,
  inject,
  input,
  numberAttribute,
  viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { SpnHeatmap } from '../heatmap/heatmap';
import { SpnCartesianGrid } from '../cartesian-grid/cartesian-grid';
import { ChartContextService } from '../chart-context.service';
import {
  renderXAxis,
  renderYAxis,
  renderGrid,
  renderReferenceLines,
  updateTooltip,
  clearTooltip,
} from '../chart-utils';
import { SpnReferenceLine } from '../reference-line/reference-line';
import {
  ChartData,
  ChartMargin,
  DEFAULT_MARGIN,
  HeatmapColorScheme,
  HeatmapLabelConfig,
  getValueByDataKey,
  isBandScale,
} from '../types';
import { SpnXAxis } from '../x-axis/x-axis';
import { SpnYAxis } from '../y-axis/y-axis';

@Component({
  selector: 'spn-heatmap-chart',
  host: {
    '[attr.title]': 'null',
  },
  template: `
    <svg
      #svgElement
      [attr.width]="responsive() ? '100%' : width()"
      [attr.height]="responsive() ? '100%' : height()"
      [attr.viewBox]="responsive() ? '0 0 ' + width() + ' ' + height() : null"
      [attr.preserveAspectRatio]="responsive() ? 'xMidYMid meet' : null"
      class="spn-heatmap-chart"
    >
      <g [attr.transform]="'translate(' + marginLeft + ',' + marginTop + ')'">
        <!-- Content projection for config components (hidden) -->
        <ng-content />

        <!-- Rendered layers (created by this component) -->
        <g class="grid-layer"></g>
        <g class="reference-lines-back-layer"></g>
        <g class="axes-layer"></g>
        <g class="cells-layer"></g>
        <g class="labels-layer"></g>
        <g class="reference-lines-front-layer"></g>

        <!-- Interaction layer for mouse events -->
        <rect
          #interactionLayer
          class="interaction-layer"
          [attr.width]="innerWidth"
          [attr.height]="innerHeight"
          fill="transparent"
          (mousemove)="onChartMouseMove($event)"
          (mouseleave)="onChartMouseLeave()"
        />
      </g>
    </svg>
    <ng-content select="spn-heatmap-legend" />
    <ng-content select="spn-tooltip" />
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 100%;
      }

      .spn-heatmap-chart {
        font-family: sans-serif;
        display: block;
      }

      .interaction-layer {
        cursor: default;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChartContextService],
})
export class SpnHeatmapChart<T = unknown> implements AfterContentInit {
  // Signal-based inputs
  readonly data = input.required<ChartData<T>>();
  readonly width = input(600, { transform: numberAttribute });
  readonly height = input(400, { transform: numberAttribute });
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly responsive = input(true);

  // View references
  readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgElement');

  // Content children - config components
  readonly xAxes = contentChildren(SpnXAxis);
  readonly yAxes = contentChildren(SpnYAxis);
  readonly heatmaps = contentChildren(SpnHeatmap);
  readonly grids = contentChildren(SpnCartesianGrid);
  readonly referenceLines = contentChildren(SpnReferenceLine);

  private readonly chartContext = inject(ChartContextService<T>);

  // Validated inputs with safe defaults
  private readonly validatedWidth = computed(() => Math.max(0, this.width()));
  private readonly validatedHeight = computed(() => Math.max(0, this.height()));
  private readonly validatedMargin = computed(() => {
    const m = this.margin();
    return {
      top: Math.max(0, m.top),
      right: Math.max(0, m.right),
      bottom: Math.max(0, m.bottom),
      left: Math.max(0, m.left),
    };
  });

  // SVG layer references
  private gridLayer?: SVGGElement;
  private referenceLinesBackLayer?: SVGGElement;
  private axesLayer?: SVGGElement;
  private cellsLayer?: SVGGElement;
  private labelsLayer?: SVGGElement;
  private referenceLinesFrontLayer?: SVGGElement;

  // Store color scale for tooltip
  private colorScale?: d3.ScaleSequential<string>;
  private valueDomain: [number, number] = [0, 100];

  // Hover state tracking
  private activeCellKey: string | null = null;

  constructor() {
    // Single consolidated effect for syncing and rendering
    effect(() => {
      // Sync validated inputs to context service
      this.chartContext.data.set(this.data());
      this.chartContext.width.set(this.validatedWidth());
      this.chartContext.height.set(this.validatedHeight());
      this.chartContext.margin.set(this.validatedMargin());

      // Track child changes to trigger re-render
      this.xAxes();
      this.yAxes();
      this.heatmaps();
      this.grids();
      this.referenceLines();

      this.render();
    });
  }

  ngAfterContentInit(): void {
    this.setupLayers();
  }

  private setupLayers(): void {
    const svg = this.svgRef()?.nativeElement;
    if (!svg) return;

    this.gridLayer = svg.querySelector('.grid-layer') as SVGGElement;
    this.referenceLinesBackLayer = svg.querySelector('.reference-lines-back-layer') as SVGGElement;
    this.axesLayer = svg.querySelector('.axes-layer') as SVGGElement;
    this.cellsLayer = svg.querySelector('.cells-layer') as SVGGElement;
    this.labelsLayer = svg.querySelector('.labels-layer') as SVGGElement;
    this.referenceLinesFrontLayer = svg.querySelector('.reference-lines-front-layer') as SVGGElement;
  }

  private render(): void {
    try {
      if (!this.axesLayer || !this.cellsLayer || !this.gridLayer || !this.labelsLayer ||
          !this.referenceLinesBackLayer || !this.referenceLinesFrontLayer) {
        this.setupLayers();
        if (!this.axesLayer || !this.cellsLayer || !this.gridLayer || !this.labelsLayer ||
            !this.referenceLinesBackLayer || !this.referenceLinesFrontLayer) return;
      }

      const data = this.data();
      if (!data.length) return;

      // Clear previous renders for all layers
      d3.select(this.gridLayer).selectAll('*').remove();
      d3.select(this.referenceLinesBackLayer).selectAll('*').remove();
      d3.select(this.axesLayer).selectAll('*').remove();
      d3.select(this.cellsLayer).selectAll('*').remove();
      d3.select(this.labelsLayer).selectAll('*').remove();
      d3.select(this.referenceLinesFrontLayer).selectAll('*').remove();

      // Render in correct z-order
      this.renderAxes();
      this.renderGrid();
      this.renderReferenceLines(false); // Back reference lines
      this.renderCells();
      this.renderReferenceLines(true); // Front reference lines
    } catch (error) {
      console.error('[SpnHeatmapChart] Render error:', error);
    }
  }

  private renderAxes(): void {
    const data = this.data();
    const innerWidth = this.chartContext.innerWidth();
    const innerHeight = this.chartContext.innerHeight();
    const heatmap = this.heatmaps()[0];

    if (!heatmap) return;

    // Get unique categories for X and Y axes
    const xCategories = this.getUniqueValues(data, heatmap.xDataKey());
    const yCategories = this.getUniqueValues(data, heatmap.yDataKey());

    // Render X axes
    this.xAxes().forEach((xAxis) => {
      if (xAxis.hide()) return;

      const scale = d3
        .scaleBand<string>()
        .domain(xCategories)
        .range([0, innerWidth])
        .padding(0.05);

      this.chartContext.registerXScale(scale, xAxis.axisId());
      renderXAxis(this.axesLayer!, xAxis, scale, innerHeight);
    });

    // Render Y axes
    this.yAxes().forEach((yAxis) => {
      if (yAxis.hide()) return;

      const scale = d3
        .scaleBand<string>()
        .domain(yCategories)
        .range([0, innerHeight])
        .padding(0.05);

      this.chartContext.registerYScale(scale, yAxis.axisId());
      renderYAxis(this.axesLayer!, yAxis, scale, innerWidth);
    });
  }

  private getUniqueValues(data: ChartData<T>, dataKey: unknown): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    data.forEach((d) => {
      const value = String(getValueByDataKey(d, dataKey as any));
      if (!seen.has(value)) {
        seen.add(value);
        result.push(value);
      }
    });

    return result;
  }

  private renderCells(): void {
    const data = this.data();
    const heatmaps = this.heatmaps();

    if (heatmaps.length === 0) return;

    const heatmap = heatmaps[0];
    if (heatmap.hide()) return;

    const xScale = this.chartContext.xScale();
    const yScale = this.chartContext.yScale();

    if (!xScale || !yScale || !isBandScale(xScale) || !isBandScale(yScale)) return;

    // Calculate value domain
    this.valueDomain = this.calculateValueDomain(data, heatmap);

    // Create color scale
    this.colorScale = this.createColorScale(heatmap.colorScheme(), this.valueDomain);

    // Override with custom colors if provided
    const minColor = heatmap.minColor();
    const maxColor = heatmap.maxColor();
    if (minColor && maxColor) {
      this.colorScale = d3
        .scaleSequential(d3.interpolateRgb(minColor, maxColor))
        .domain(this.valueDomain);
    }

    const cellPadding = heatmap.cellPadding();
    const cellRadius = heatmap.cellRadius();
    const nullColor = heatmap.nullColor();
    const isAnimationActive = heatmap.isAnimationActive();
    const animationDuration = heatmap.animationDuration();
    const labelConfig = heatmap.label();

    // Create cells group
    const cellsGroup = d3.select(this.cellsLayer!);
    const labelsGroup = d3.select(this.labelsLayer!);

    data.forEach((d, i) => {
      const xValue = String(getValueByDataKey(d, heatmap.xDataKey()));
      const yValue = String(getValueByDataKey(d, heatmap.yDataKey()));
      const value = getValueByDataKey(d, heatmap.valueDataKey()) as number;

      const x = (xScale(xValue) ?? 0) + cellPadding;
      const y = (yScale(yValue) ?? 0) + cellPadding;
      const width = xScale.bandwidth() - cellPadding * 2;
      const height = yScale.bandwidth() - cellPadding * 2;

      // Determine color
      const color = value != null ? this.colorScale!(value) : nullColor;

      const cellKey = `${xValue}|${yValue}`;
      const rect = cellsGroup
        .append('rect')
        .attr('class', `cell cell-${i}`)
        .attr('data-cell-key', cellKey)
        .attr('data-base-fill', color)
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', color)
        .attr('opacity', 1)
        .style('cursor', 'pointer');

      if (cellRadius > 0) {
        rect.attr('rx', cellRadius).attr('ry', cellRadius);
      }

      // Animation
      if (isAnimationActive) {
        rect
          .attr('opacity', 0)
          .transition('entry')
          .duration(animationDuration)
          .delay(i * 10) // Stagger animation
          .attr('opacity', 1);
      }

      // Render label if enabled
      if (labelConfig && value != null) {
        const config = typeof labelConfig === 'boolean' ? {} : labelConfig;
        const labelText = this.formatLabelValue(value, config);
        const fontSize = config.fontSize ?? 12;
        const fontWeight = config.fontWeight ?? 'normal';
        const labelFill = config.fill ?? this.getContrastColor(color);

        const text = labelsGroup
          .append('text')
          .attr('class', `cell-label cell-label-${i}`)
          .attr('x', x + width / 2)
          .attr('y', y + height / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', labelFill)
          .attr('font-size', fontSize)
          .attr('font-weight', fontWeight)
          .style('pointer-events', 'none')
          .text(labelText);

        // Animation for labels
        if (isAnimationActive) {
          text
            .attr('opacity', 0)
            .transition()
            .duration(animationDuration)
            .delay(i * 10)
            .attr('opacity', 1);
        }
      }
    });
  }

  private formatLabelValue(value: number, config: HeatmapLabelConfig): string {
    if (config.formatter) {
      return config.formatter(value);
    }
    // Default: show integer or 1 decimal
    return value % 1 === 0 ? String(value) : value.toFixed(1);
  }

  private getContrastColor(backgroundColor: string): string {
    // Parse the color to get RGB values
    const color = d3.color(backgroundColor);
    if (!color) return '#000000';

    const rgb = color.rgb();
    // Calculate relative luminance using sRGB formula
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  private calculateValueDomain(data: ChartData<T>, heatmap: SpnHeatmap): [number, number] {
    const customDomain = heatmap.valueDomain();
    if (customDomain) {
      return customDomain;
    }

    let min = Infinity;
    let max = -Infinity;

    data.forEach((d) => {
      const value = getValueByDataKey(d, heatmap.valueDataKey()) as number;
      if (value != null && !isNaN(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });

    // Handle edge cases
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 100;
    if (min === max) {
      min = min - 1;
      max = max + 1;
    }

    return [min, max];
  }

  private createColorScale(
    scheme: HeatmapColorScheme,
    domain: [number, number]
  ): d3.ScaleSequential<string> {
    const interpolator = this.getColorInterpolator(scheme);
    return d3.scaleSequential(interpolator).domain(domain);
  }

  private getColorInterpolator(scheme: HeatmapColorScheme): (t: number) => string {
    switch (scheme) {
      case 'blues':
        return d3.interpolateBlues;
      case 'greens':
        return d3.interpolateGreens;
      case 'reds':
        return d3.interpolateReds;
      case 'purples':
        return d3.interpolatePurples;
      case 'oranges':
        return d3.interpolateOranges;
      case 'viridis':
        return d3.interpolateViridis;
      case 'plasma':
        return d3.interpolatePlasma;
      case 'warm':
        return d3.interpolateWarm;
      case 'cool':
        return d3.interpolateCool;
      case 'RdYlBu':
        return d3.interpolateRdYlBu;
      case 'RdYlGn':
        return d3.interpolateRdYlGn;
      case 'spectral':
        return d3.interpolateSpectral;
      default:
        return d3.interpolateBlues;
    }
  }

  get innerWidth(): number {
    return this.chartContext.innerWidth();
  }

  get innerHeight(): number {
    return this.chartContext.innerHeight();
  }

  get marginLeft(): number {
    return this.validatedMargin().left;
  }

  get marginTop(): number {
    return this.validatedMargin().top;
  }

  // Grid rendering
  private renderGrid(): void {
    if (!this.gridLayer) return;

    const grids = this.grids();
    if (grids.length === 0) return;

    const grid = grids[0];
    const innerWidth = this.chartContext.innerWidth();
    const innerHeight = this.chartContext.innerHeight();
    const xScale = this.chartContext.xScale();
    const yScale = this.chartContext.yScale();

    if (!xScale || !yScale) return;

    renderGrid(this.gridLayer, grid, innerWidth, innerHeight, xScale, yScale);
  }

  // Reference line rendering
  private renderReferenceLines(isFront: boolean): void {
    const layer = isFront ? this.referenceLinesFrontLayer : this.referenceLinesBackLayer;
    if (!layer) return;

    const refLines = this.referenceLines();
    if (refLines.length === 0) return;

    const innerWidth = this.chartContext.innerWidth();
    const innerHeight = this.chartContext.innerHeight();

    renderReferenceLines(
      layer,
      refLines,
      innerWidth,
      innerHeight,
      this.chartContext as ChartContextService<unknown>,
      isFront
    );
  }

  // Mouse interaction handlers
  onChartMouseMove(event: MouseEvent): void {
    if (!this.cellsLayer) return;

    const [mouseX, mouseY] = d3.pointer(event, this.cellsLayer);
    const data = this.data();
    const heatmaps = this.heatmaps();

    if (heatmaps.length === 0) return;

    const heatmap = heatmaps[0];
    const xScale = this.chartContext.xScale();
    const yScale = this.chartContext.yScale();

    if (!xScale || !yScale || !isBandScale(xScale) || !isBandScale(yScale)) return;

    // Find which cell the mouse is over
    const result = this.findCellAtPosition(mouseX, mouseY, data, xScale, yScale, heatmap);

    if (!result) {
      clearTooltip(this.chartContext as ChartContextService<any>);
      this.chartContext.clearHoverState();
      if (this.activeCellKey !== null) {
        this.activeCellKey = null;
        if (this.hasHoverEffectsConfigured()) {
          this.updateHoverStyles();
        }
      }
      return;
    }

    const { dataPoint, xValue, yValue } = result;
    const cellKey = `${xValue}|${yValue}`;

    // Update hover state for visual feedback
    this.chartContext.setHoverState({
      activeDataIndex: data.indexOf(dataPoint),
      elementType: 'cell',
    });

    if (this.activeCellKey !== cellKey) {
      this.activeCellKey = cellKey;
      if (this.hasHoverEffectsConfigured()) {
        this.updateHoverStyles();
      }
    }
    const value = getValueByDataKey(dataPoint, heatmap.valueDataKey()) as number;

    // Calculate tooltip position (center of the cell)
    const cellX = (xScale(xValue) ?? 0) + xScale.bandwidth() / 2;
    const cellY = (yScale(yValue) ?? 0) + yScale.bandwidth() / 2;

    // Build tooltip payload
    const payload = [
      {
        name: heatmap.name() || 'Value',
        value: value,
        dataKey: heatmap.valueDataKey(),
        color: this.colorScale ? this.colorScale(value) : '#8884d8',
        payload: dataPoint,
      },
    ];

    // Use row and column as label
    const label = `${xValue} / ${yValue}`;

    updateTooltip(
      this.chartContext as ChartContextService<any>,
      0,
      { x: cellX, y: cellY },
      payload,
      label,
      this.marginLeft,
      this.marginTop,
      this.responsive(),
      this.width(),
      this.height(),
      this.svgRef()?.nativeElement
    );
  }

  private findCellAtPosition(
    mouseX: number,
    mouseY: number,
    data: ChartData<T>,
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleBand<string>,
    heatmap: SpnHeatmap
  ): { dataPoint: T; xValue: string; yValue: string } | null {
    // Find which x and y category the mouse is over
    const xDomain = xScale.domain();
    const yDomain = yScale.domain();

    let foundX: string | null = null;
    let foundY: string | null = null;

    for (const x of xDomain) {
      const xPos = xScale(x) ?? 0;
      if (mouseX >= xPos && mouseX <= xPos + xScale.bandwidth()) {
        foundX = x;
        break;
      }
    }

    for (const y of yDomain) {
      const yPos = yScale(y) ?? 0;
      if (mouseY >= yPos && mouseY <= yPos + yScale.bandwidth()) {
        foundY = y;
        break;
      }
    }

    if (!foundX || !foundY) return null;

    // Find the data point for this cell
    const dataPoint = data.find((d) => {
      const xVal = String(getValueByDataKey(d, heatmap.xDataKey()));
      const yVal = String(getValueByDataKey(d, heatmap.yDataKey()));
      return xVal === foundX && yVal === foundY;
    });

    if (!dataPoint) return null;

    return { dataPoint, xValue: foundX, yValue: foundY };
  }

  onChartMouseLeave(): void {
    clearTooltip(this.chartContext as ChartContextService<any>);
    this.chartContext.clearHoverState();
    if (this.activeCellKey !== null) {
      this.activeCellKey = null;
      if (this.hasHoverEffectsConfigured()) {
        this.updateHoverStyles();
      }
    }
  }

  /**
   * Check if the heatmap has hover effects configured
   */
  private hasHoverEffectsConfigured(): boolean {
    const heatmaps = this.heatmaps();
    if (heatmaps.length === 0) return false;

    const heatmap = heatmaps[0];
    return !!(heatmap.hoverStroke() || heatmap.dimOthers());
  }

  /**
   * Update hover styles for all cells based on activeCellKey
   */
  private updateHoverStyles(): void {
    if (!this.cellsLayer) return;

    const heatmaps = this.heatmaps();
    if (heatmaps.length === 0) return;

    const heatmap = heatmaps[0];
    const hoverStroke = heatmap.hoverStroke();
    const hoverStrokeWidth = heatmap.hoverStrokeWidth();
    const hoverOpacity = heatmap.hoverOpacity();
    const dimOthers = heatmap.dimOthers();
    const dimOpacity = heatmap.dimOpacity();
    const transitionDuration = heatmap.hoverTransitionDuration();


    // Select all cell elements
    const allCells = d3.select(this.cellsLayer).selectAll<SVGRectElement, unknown>('.cell');

    allCells.each((_, i, nodes) => {
      const element = d3.select(nodes[i]);
      const cellKey = element.attr('data-cell-key');

      // Interrupt any existing hover transition and create new one
      element.interrupt('hover');
      const transition = element.transition('hover').duration(transitionDuration);

      if (this.activeCellKey === null) {
        // No hover - reset to base styles
        transition
          .attr('stroke', null)
          .attr('stroke-width', null)
          .attr('opacity', 1);
      } else if (cellKey === this.activeCellKey) {
        // This cell is hovered - apply hover styles
        transition
          .attr('stroke', hoverStroke || '#333')
          .attr('stroke-width', hoverStrokeWidth)
          .attr('opacity', hoverOpacity);
      } else if (dimOthers) {
        // Other cells - dim them (don't change fill)
        transition.attr('opacity', dimOpacity);
      } else {
        // Other cells without dimming - reset opacity only
        transition.attr('opacity', 1);
      }
    });
  }
}
