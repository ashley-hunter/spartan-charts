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
import { SpnCartesianGrid } from '../cartesian-grid/cartesian-grid';
import { ChartContextService } from '../chart-context.service';
import {
  renderXAxis,
  renderYAxis,
  renderGrid,
  renderReferenceLines,
  createXScale,
  createYScale,
  calculateAxisDomain,
  findNearestScatterPoint,
  updateTooltip,
  clearTooltip,
  calculateScatterXDomain,
} from '../chart-utils';
import { CURVE_MAP } from '../constants';
import { SpnReferenceLine } from '../reference-line/reference-line';
import { SpnScatter } from '../scatter/scatter';
import {
  ChartData,
  ChartLayout,
  ChartMargin,
  DEFAULT_MARGIN,
  Scale,
  getValueByDataKey,
} from '../types';
import { SpnXAxis } from '../x-axis/x-axis';
import { SpnYAxis } from '../y-axis/y-axis';


@Component({
  selector: 'spn-scatter-chart',
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
      class="spn-scatter-chart"
    >
      <g [attr.transform]="'translate(' + marginLeft + ',' + marginTop + ')'">
        <!-- Content projection for config components (hidden) -->
        <ng-content />

        <!-- Rendered layers (created by this component) -->
        <g class="grid-layer"></g>
        <g class="reference-lines-back"></g>
        <g class="axes-layer"></g>
        <g class="lines-layer"></g>
        <g class="points-layer"></g>
        <g class="reference-lines-front"></g>

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
    <ng-content select="spn-legend" />
    <ng-content select="spn-tooltip" />
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 100%;
      }

      .spn-scatter-chart {
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
export class SpnScatterChart<T = unknown> implements AfterContentInit {
  // Signal-based inputs
  readonly data = input.required<ChartData<T>>();
  readonly width = input(600, { transform: numberAttribute });
  readonly height = input(400, { transform: numberAttribute });
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly layout = input<ChartLayout>('horizontal');
  readonly responsive = input(true); // Enable responsive by default

  // View references
  readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgElement');

  // Content children - config components
  readonly xAxes = contentChildren(SpnXAxis);
  readonly yAxes = contentChildren(SpnYAxis);
  readonly scatters = contentChildren(SpnScatter);
  readonly grids = contentChildren(SpnCartesianGrid);
  readonly referenceLines = contentChildren(SpnReferenceLine);

  private readonly chartContext = inject(ChartContextService<T>);

  // Track active scatter index for highlighting
  private activeScatterIndex = -1;
  private activeDataIndex = -1;

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
  private linesLayer?: SVGGElement;
  private pointsLayer?: SVGGElement;
  private referenceLinesFrontLayer?: SVGGElement;
  private interactionLayerRef?: SVGRectElement;

  constructor() {
    // Single consolidated effect for syncing and rendering
    effect(() => {
      // Sync validated inputs to context service
      this.chartContext.data.set(this.data());
      this.chartContext.width.set(this.validatedWidth());
      this.chartContext.height.set(this.validatedHeight());
      this.chartContext.margin.set(this.validatedMargin());
      this.chartContext.layout.set(this.layout());

      // Track child changes to trigger re-render
      this.xAxes();
      this.yAxes();
      this.scatters();
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
    this.referenceLinesBackLayer = svg.querySelector(
      '.reference-lines-back',
    ) as SVGGElement;
    this.axesLayer = svg.querySelector('.axes-layer') as SVGGElement;
    this.linesLayer = svg.querySelector('.lines-layer') as SVGGElement;
    this.pointsLayer = svg.querySelector('.points-layer') as SVGGElement;
    this.referenceLinesFrontLayer = svg.querySelector(
      '.reference-lines-front',
    ) as SVGGElement;
    this.interactionLayerRef = svg.querySelector(
      '.interaction-layer',
    ) as SVGRectElement;
  }

  private render(): void {
    try {
      if (!this.axesLayer || !this.pointsLayer || !this.gridLayer || !this.linesLayer) {
        this.setupLayers();
        if (!this.axesLayer || !this.pointsLayer || !this.gridLayer || !this.linesLayer) return;
      }

      const data = this.data();
      if (!data.length) return;

      // Clear previous renders for all layers
      d3.select(this.gridLayer).selectAll('*').remove();
      if (this.referenceLinesBackLayer) {
        d3.select(this.referenceLinesBackLayer).selectAll('*').remove();
      }
      d3.select(this.axesLayer).selectAll('*').remove();
      d3.select(this.linesLayer).selectAll('*').remove();
      d3.select(this.pointsLayer).selectAll('*').remove();
      if (this.referenceLinesFrontLayer) {
        d3.select(this.referenceLinesFrontLayer).selectAll('*').remove();
      }

      // Render in correct z-order
      this.renderAxes(); // Create scales first
      this.renderGrid(); // Use scales to draw grid
      this.renderReferenceLines(false); // Back reference lines
      this.renderScatterLines(); // Draw connecting lines (behind points)
      this.renderScatterPoints(); // Draw scatter points
      this.renderReferenceLines(true); // Front reference lines
    } catch (error) {
      console.error('[SpnScatterChart] Render error:', error);
    }
  }

  private renderAxes(): void {
    const data = this.data();
    const innerWidth = this.chartContext.innerWidth();
    const innerHeight = this.chartContext.innerHeight();

    // Render X axes
    this.xAxes().forEach((xAxis) => {
      if (xAxis.hide()) return;

      // For scatter charts, calculate domain from scatter x data keys
      const domain = this.calculateXAxisDomainFromScatters(
        data,
        xAxis.axisId(),
        xAxis.domain(),
        xAxis.dataKey(),
        xAxis.type(),
      );
      const scale = createXScale(
        data,
        domain,
        xAxis.type(),
        xAxis.dataKey(),
        innerWidth,
      );

      this.chartContext.registerXScale(scale, xAxis.axisId());
      renderXAxis(this.axesLayer!, xAxis, scale, innerHeight);
    });

    // Render Y axes
    this.yAxes().forEach((yAxis) => {
      if (yAxis.hide()) return;

      const domain = this.calculateYAxisDomainFromScatters(
        data,
        yAxis.axisId(),
        yAxis.domain(),
      );
      const scale = createYScale(
        data,
        domain,
        yAxis.type(),
        yAxis.dataKey(),
        innerHeight,
      );

      this.chartContext.registerYScale(scale, yAxis.axisId());
      renderYAxis(this.axesLayer!, yAxis, scale, innerWidth);
    });
  }

  private calculateXAxisDomainFromScatters(
    data: ChartData<T>,
    axisId: string,
    domainInput: [string | number | Date, string | number | Date] | ['auto', 'auto'] | ['dataMin', 'dataMax'],
    dataKey: unknown,
    type: string,
  ): [number | string | Date, number | string | Date] {
    if (domainInput[0] !== 'auto' && domainInput[0] !== 'dataMin') {
      return domainInput as [number | string | Date, number | string | Date];
    }

    // Get all visible scatters that use this X axis
    const scattersForAxis = this.scatters().filter(
      (scatter) => !scatter.hide() && scatter.xAxisId() === axisId
    );

    if (scattersForAxis.length === 0) {
      // Fall back to axis dataKey if no scatters
      if (dataKey) {
        return calculateAxisDomain(data, dataKey as string, type as 'number' | 'category' | 'time', domainInput);
      }
      return [0, 100];
    }

    // Use the utility for domain calculation
    return calculateScatterXDomain(
      data,
      scattersForAxis.map(s => ({
        xDataKey: s.xDataKey(),
        hide: s.hide(),
        xAxisId: s.xAxisId(),
        data: s.data() as ChartData<T> | undefined,
      })),
      axisId,
      domainInput,
      { padding: 0.05 }
    );
  }

  private calculateYAxisDomainFromScatters(
    data: ChartData<T>,
    axisId: string,
    domainInput: [string | number | Date, string | number | Date] | ['auto', 'auto'] | ['dataMin', 'dataMax'],
  ): [number | string | Date, number | string | Date] {
    if (domainInput[0] !== 'auto' && domainInput[0] !== 'dataMin') {
      return domainInput as [number | string | Date, number | string | Date];
    }

    // Get all visible scatters that use this Y axis
    const scattersForAxis = this.scatters().filter(
      (scatter) => !scatter.hide() && scatter.yAxisId() === axisId
    );

    if (scattersForAxis.length === 0) {
      return [0, 100];
    }

    // Calculate min/max across all scatters
    let minValue = Infinity;
    let maxValue = -Infinity;

    scattersForAxis.forEach((scatter) => {
      const scatterData = scatter.data() || data;
      scatterData.forEach((d) => {
        const value = getValueByDataKey(d, scatter.yDataKey()) as number;
        if (value != null && !isNaN(value)) {
          minValue = Math.min(minValue, value);
          maxValue = Math.max(maxValue, value);
        }
      });
    });

    if (minValue === Infinity || maxValue === -Infinity) {
      return [0, 100];
    }

    // Add some padding to the domain
    const padding = (maxValue - minValue) * 0.05;
    return [minValue - padding, maxValue + padding];
  }

  private renderScatterLines(): void {
    if (!this.linesLayer) return;

    const data = this.data();

    this.scatters().forEach((scatter) => {
      if (scatter.hide() || !scatter.line()) return;

      const xScale = this.chartContext.getXScale(scatter.xAxisId());
      const yScale = this.chartContext.getYScale(scatter.yAxisId());

      if (!xScale || !yScale) return;

      const scatterData = scatter.data() || data;
      this.renderConnectingLine(scatter, scatterData as T[], xScale, yScale);
    });
  }

  private renderConnectingLine(
    scatter: SpnScatter<T>,
    data: T[],
    xScale: Scale,
    yScale: Scale,
  ): void {
    if (!this.linesLayer) return;

    const lineGenerator = d3
      .line<T>()
      .x((d) => {
        const value = getValueByDataKey(d, scatter.xDataKey());
        return (xScale as d3.ScaleLinear<number, number>)(value as number);
      })
      .y((d) => {
        const value = getValueByDataKey(d, scatter.yDataKey());
        return (yScale as d3.ScaleLinear<number, number>)(value as number);
      })
      .curve(CURVE_MAP[scatter.lineCurve()] || d3.curveLinear);

    const pathData = lineGenerator(data);
    if (!pathData) return;

    const lineStroke = scatter.lineStroke() || scatter.fill();

    const path = d3
      .select(this.linesLayer)
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineStroke)
      .attr('stroke-width', scatter.lineStrokeWidth())
      .attr('opacity', scatter.opacity());

    if (scatter.isAnimationActive()) {
      path
        .attr('d', pathData)
        .attr('stroke-dasharray', function (this: SVGPathElement) {
          const length = this.getTotalLength();
          return `${length} ${length}`;
        })
        .attr('stroke-dashoffset', function (this: SVGPathElement) {
          return this.getTotalLength();
        })
        .transition()
        .duration(scatter.animationDuration())
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('end', function (this: SVGPathElement) {
          d3.select(this).attr('stroke-dasharray', 'none');
        });
    } else {
      path.attr('d', pathData);
    }
  }

  private renderScatterPoints(): void {
    if (!this.pointsLayer) return;

    const data = this.data();

    this.scatters().forEach((scatter, scatterIndex) => {
      if (scatter.hide()) return;

      const xScale = this.chartContext.getXScale(scatter.xAxisId());
      const yScale = this.chartContext.getYScale(scatter.yAxisId());

      if (!xScale || !yScale) return;

      const scatterData = scatter.data() || data;
      this.renderPoints(scatter, scatterData as T[], xScale, yScale, scatterIndex);
    });
  }

  private renderPoints(
    scatter: SpnScatter<T>,
    data: T[],
    xScale: Scale,
    yScale: Scale,
    scatterIndex: number,
  ): void {
    if (!this.pointsLayer) return;

    // Calculate radius from area (size is area in px^2)
    const baseRadius = Math.sqrt(scatter.size() / Math.PI);
    const activeRadius = Math.sqrt(scatter.activeSize() / Math.PI);

    const fill = scatter.fill();
    const stroke = scatter.stroke();
    const strokeWidth = scatter.strokeWidth();
    const opacity = scatter.opacity();

    // Create a group for this scatter series
    const scatterGroup = d3
      .select(this.pointsLayer)
      .append('g')
      .attr('class', `scatter-points scatter-${scatterIndex}`);

    // Render each point
    data.forEach((d, dataIndex) => {
      const xValue = getValueByDataKey(d, scatter.xDataKey());
      const yValue = getValueByDataKey(d, scatter.yDataKey());

      if (xValue == null || yValue == null) return;

      const cx = (xScale as d3.ScaleLinear<number, number>)(xValue as number);
      const cy = (yScale as d3.ScaleLinear<number, number>)(yValue as number);

      if (isNaN(cx) || isNaN(cy)) return;

      const isActive = this.activeScatterIndex === scatterIndex && this.activeDataIndex === dataIndex;
      const currentRadius = isActive ? activeRadius : baseRadius;
      const currentFill = isActive ? (scatter.activeFill() || fill) : fill;
      const currentStroke = isActive ? scatter.activeStroke() : stroke;
      const currentStrokeWidth = isActive ? scatter.activeStrokeWidth() : strokeWidth;

      const circle = scatterGroup
        .append('circle')
        .attr('class', `point point-${dataIndex}`)
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('fill', currentFill)
        .attr('opacity', opacity)
        .style('cursor', 'pointer');

      if (currentStroke) {
        circle.attr('stroke', currentStroke).attr('stroke-width', currentStrokeWidth);
      }

      if (scatter.isAnimationActive() && !isActive) {
        // Animate with elastic easing for a bouncy effect
        circle
          .attr('r', 0)
          .transition()
          .delay(dataIndex * 30) // Staggered animation
          .duration(scatter.animationDuration())
          .ease(d3.easeElasticOut.amplitude(1).period(0.4))
          .attr('r', currentRadius);
      } else {
        circle.attr('r', currentRadius);
      }
    });
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

    const grid = grids[0]; // Use first grid config
    const innerWidth = this.chartContext.innerWidth();
    const innerHeight = this.chartContext.innerHeight();
    const xScale = this.chartContext.xScale();
    const yScale = this.chartContext.yScale();

    if (!xScale || !yScale) return;

    renderGrid(this.gridLayer, grid, innerWidth, innerHeight, xScale, yScale);
  }

  // Reference line rendering
  private renderReferenceLines(isFront: boolean): void {
    const layer = isFront
      ? this.referenceLinesFrontLayer
      : this.referenceLinesBackLayer;
    if (!layer) return;

    const innerWidth = this.chartContext.innerWidth();
    const innerHeight = this.chartContext.innerHeight();

    renderReferenceLines(
      layer,
      this.referenceLines(),
      innerWidth,
      innerHeight,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.chartContext as ChartContextService<any>,
      isFront
    );
  }

  // Helper to find nearest scatter point across all series
  private findNearestPoint(
    mouseX: number,
    mouseY: number,
    data: ChartData<T>
  ): {
    scatterIndex: number;
    dataIndex: number;
    dataPoint: T;
    distance: number;
    scatter: SpnScatter<T>;
  } | null {
    let nearestResult: {
      scatterIndex: number;
      dataIndex: number;
      dataPoint: T;
      distance: number;
      scatter: SpnScatter<T>;
    } | null = null;

    this.scatters().forEach((scatter, scatterIndex) => {
      if (scatter.hide()) return;

      const scatterData = scatter.data() || data;
      const scatterXScale = this.chartContext.getXScale(scatter.xAxisId());
      const scatterYScale = this.chartContext.getYScale(scatter.yAxisId());

      if (!scatterXScale || !scatterYScale) return;

      const result = findNearestScatterPoint(
        mouseX,
        mouseY,
        scatterData,
        scatterXScale as d3.ScaleLinear<number, number>,
        scatterYScale as d3.ScaleLinear<number, number>,
        scatter.xDataKey(),
        scatter.yDataKey(),
        50 // maxDistance
      );

      if (result && (!nearestResult || result.distance < nearestResult.distance)) {
        nearestResult = {
          scatterIndex,
          dataIndex: result.dataIndex,
          dataPoint: result.dataPoint as T,
          distance: result.distance,
          scatter,
        };
      }
    });

    return nearestResult;
  }

  // Mouse interaction handlers
  onChartMouseMove(event: MouseEvent): void {
    if (!this.pointsLayer || !this.interactionLayerRef) return;

    const [mouseX, mouseY] = d3.pointer(event, this.pointsLayer);
    const data = this.data();
    const xScale = this.chartContext.xScale();
    const yScale = this.chartContext.yScale();

    if (!xScale || !yScale || data.length === 0) return;

    // Find the nearest point across all scatter series
    const nearestResult = this.findNearestPoint(mouseX, mouseY, data);

    if (nearestResult) {
      const activeScatter = nearestResult.scatter;
      const activeScatterIndex = nearestResult.scatterIndex;
      const activeDataIndex = nearestResult.dataIndex;
      const activeDataPoint = nearestResult.dataPoint;

      // Update active point tracking
      const needsRerender = this.activeScatterIndex !== activeScatterIndex || this.activeDataIndex !== activeDataIndex;
      this.activeScatterIndex = activeScatterIndex;
      this.activeDataIndex = activeDataIndex;

      // Get position of the active point
      const scatterXScale = this.chartContext.getXScale(activeScatter.xAxisId());
      const scatterYScale = this.chartContext.getYScale(activeScatter.yAxisId());

      if (!scatterXScale || !scatterYScale) return;

      const xValue = getValueByDataKey(activeDataPoint, activeScatter.xDataKey());
      const yValue = getValueByDataKey(activeDataPoint, activeScatter.yDataKey());

      const position = {
        x: (scatterXScale as d3.ScaleLinear<number, number>)(xValue as number),
        y: (scatterYScale as d3.ScaleLinear<number, number>)(yValue as number),
      };

      // Build tooltip payload from all visible scatters at this data point
      const payload = this.scatters()
        .filter((s) => !s.hide())
        .map((s) => {
          const sData = s.data() || data;
          const sDataPoint = sData[activeDataIndex] || activeDataPoint;
          return {
            name: s.name() || String(s.yDataKey()),
            value: getValueByDataKey(sDataPoint, s.yDataKey()),
            dataKey: s.yDataKey(),
            color: s.fill(),
            payload: sDataPoint,
          };
        });

      // Use x value as label
      const label = String(xValue);

      updateTooltip(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.chartContext as ChartContextService<any>,
        activeDataIndex,
        position,
        payload,
        label,
        this.marginLeft,
        this.marginTop,
        this.responsive(),
        this.width(),
        this.height(),
        this.svgRef()?.nativeElement
      );

      // Re-render points to show active state
      if (needsRerender) {
        this.updateActivePoint();
      }
    } else {
      // No point nearby - clear tooltip
      this.onChartMouseLeave();
    }
  }

  onChartMouseLeave(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearTooltip(this.chartContext as ChartContextService<any>);

    // Clear active point tracking
    if (this.activeScatterIndex !== -1 || this.activeDataIndex !== -1) {
      this.activeScatterIndex = -1;
      this.activeDataIndex = -1;
      this.updateActivePoint();
    }
  }

  private updateActivePoint(): void {
    if (!this.pointsLayer) return;

    const data = this.data();
    const pointsLayer = this.pointsLayer; // Store reference for TypeScript

    this.scatters().forEach((scatter, scatterIndex) => {
      if (scatter.hide()) return;

      const scatterData = scatter.data() || data;
      const baseRadius = Math.sqrt(scatter.size() / Math.PI);
      const activeRadius = Math.sqrt(scatter.activeSize() / Math.PI);
      const fill = scatter.fill();
      const stroke = scatter.stroke();
      const strokeWidth = scatter.strokeWidth();

      const scatterGroup = d3.select(pointsLayer).select(`.scatter-${scatterIndex}`);

      scatterData.forEach((_, dataIndex) => {
        const isActive = this.activeScatterIndex === scatterIndex && this.activeDataIndex === dataIndex;
        const circle = scatterGroup.select(`.point-${dataIndex}`);

        if (!circle.empty()) {
          circle
            .transition()
            .duration(150)
            .attr('r', isActive ? activeRadius : baseRadius)
            .attr('fill', isActive ? (scatter.activeFill() || fill) : fill)
            .attr('stroke', isActive ? scatter.activeStroke() : (stroke || null))
            .attr('stroke-width', isActive ? scatter.activeStrokeWidth() : strokeWidth);
        }
      });
    });
  }
}
