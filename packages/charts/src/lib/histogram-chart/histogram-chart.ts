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
import { SpnHistogram } from '../histogram/histogram';
import { SpnCartesianGrid } from '../cartesian-grid/cartesian-grid';
import { ChartContextService } from '../chart-context.service';
import {
  renderXAxis,
  renderYAxis,
  renderGrid,
  renderReferenceLines,
  createLinearScale,
  updateTooltip,
  clearTooltip,
} from '../chart-utils';
import { SpnReferenceLine } from '../reference-line/reference-line';
import {
  ChartData,
  ChartMargin,
  DEFAULT_MARGIN,
  DataKey,
  getValueByDataKey,
  isLinearScale,
} from '../types';
import { SpnXAxis } from '../x-axis/x-axis';
import { SpnYAxis } from '../y-axis/y-axis';

/**
 * Histogram bin structure returned by D3
 */
interface HistogramBin {
  x0: number; // Lower bound (inclusive)
  x1: number; // Upper bound (exclusive)
  length: number; // Count of values in bin
  values: number[]; // The actual values in the bin
}

@Component({
  selector: 'spn-histogram-chart',
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
      class="spn-histogram-chart"
    >
      <g [attr.transform]="'translate(' + marginLeft + ',' + marginTop + ')'">
        <!-- Content projection for config components (hidden) -->
        <ng-content />

        <!-- Rendered layers (created by this component) -->
        <g class="grid-layer"></g>
        <g class="reference-lines-back"></g>
        <g class="axes-layer"></g>
        <g class="bars-layer"></g>
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

      .spn-histogram-chart {
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
export class SpnHistogramChart<T = unknown> implements AfterContentInit {
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
  readonly histograms = contentChildren(SpnHistogram);
  readonly grids = contentChildren(SpnCartesianGrid);
  readonly referenceLines = contentChildren(SpnReferenceLine);

  private readonly chartContext = inject(ChartContextService<T>);

  // Computed bins for each histogram
  private computedBins = new Map<SpnHistogram, HistogramBin[]>();

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
  private barsLayer?: SVGGElement;
  private referenceLinesFrontLayer?: SVGGElement;

  constructor() {
    // Single consolidated effect for syncing and rendering
    effect(() => {
      // Sync validated inputs to context service
      this.chartContext.data.set(this.data());
      this.chartContext.width.set(this.validatedWidth());
      this.chartContext.height.set(this.validatedHeight());
      this.chartContext.margin.set(this.validatedMargin());
      this.chartContext.layout.set('vertical');

      // Track child changes to trigger re-render
      this.xAxes();
      this.yAxes();
      this.histograms();
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
    this.barsLayer = svg.querySelector('.bars-layer') as SVGGElement;
    this.referenceLinesFrontLayer = svg.querySelector(
      '.reference-lines-front',
    ) as SVGGElement;
  }

  private render(): void {
    try {
      if (!this.axesLayer || !this.barsLayer || !this.gridLayer) {
        this.setupLayers();
        if (!this.axesLayer || !this.barsLayer || !this.gridLayer) return;
      }

      const data = this.data();
      if (!data.length) return;

      // Clear previous renders for all layers
      d3.select(this.gridLayer).selectAll('*').remove();
      if (this.referenceLinesBackLayer) {
        d3.select(this.referenceLinesBackLayer).selectAll('*').remove();
      }
      d3.select(this.axesLayer).selectAll('*').remove();
      d3.select(this.barsLayer).selectAll('*').remove();
      if (this.referenceLinesFrontLayer) {
        d3.select(this.referenceLinesFrontLayer).selectAll('*').remove();
      }

      // Compute bins for all histograms
      this.computedBins.clear();
      this.histograms().forEach((histogram) => {
        if (!histogram.hide()) {
          const bins = this.computeBins(data, histogram);
          this.computedBins.set(histogram, bins);
        }
      });

      // Render in correct z-order
      this.renderAxes();
      this.renderGrid();
      this.renderReferenceLines(false);
      this.renderHistogramBars();
      this.renderReferenceLines(true);
    } catch (error) {
      console.error('[SpnHistogramChart] Render error:', error);
    }
  }

  private computeBins(data: ChartData<T>, histogram: SpnHistogram): HistogramBin[] {
    const dataKey = histogram.dataKey() as DataKey<T>;
    const values = data
      .map((d) => getValueByDataKey(d, dataKey) as number)
      .filter((v) => v != null && !isNaN(v));

    if (values.length === 0) return [];

    // Determine domain
    let domain = histogram.domain();
    if (!domain) {
      const extent = d3.extent(values) as [number, number];
      domain = extent;
    }

    // Apply nice() for friendly boundaries if requested
    if (histogram.nice()) {
      const tempScale = d3.scaleLinear().domain(domain);
      domain = tempScale.nice().domain() as [number, number];
    }

    // Determine thresholds
    const customThresholds = histogram.thresholds();
    const binCount = histogram.binCount();

    // Create bin generator
    const binGenerator = d3.bin<number, number>().domain(domain);

    if (customThresholds && customThresholds.length > 0) {
      binGenerator.thresholds(customThresholds);
    } else if (binCount !== undefined && binCount > 0) {
      // Generate evenly spaced thresholds
      const thresholdArray = d3.range(
        domain[0],
        domain[1],
        (domain[1] - domain[0]) / binCount
      );
      binGenerator.thresholds(thresholdArray);
    } else {
      // Use Sturges' formula (D3 default)
      binGenerator.thresholds(d3.thresholdSturges);
    }

    // Generate bins
    const d3Bins = binGenerator(values);

    // Convert to our HistogramBin format
    return d3Bins.map((bin) => ({
      x0: bin.x0 ?? domain![0],
      x1: bin.x1 ?? domain![1],
      length: bin.length,
      values: [...bin],
    }));
  }

  private renderAxes(): void {
    const innerWidth = this.chartContext.innerWidth();
    const innerHeight = this.chartContext.innerHeight();

    // Calculate x domain from all histogram bins
    let xMin = Infinity;
    let xMax = -Infinity;
    this.computedBins.forEach((bins) => {
      bins.forEach((bin) => {
        xMin = Math.min(xMin, bin.x0);
        xMax = Math.max(xMax, bin.x1);
      });
    });

    // Calculate y domain (max count)
    let yMax = 0;
    this.computedBins.forEach((bins) => {
      bins.forEach((bin) => {
        yMax = Math.max(yMax, bin.length);
      });
    });

    // Ensure we have valid domains
    if (!isFinite(xMin)) xMin = 0;
    if (!isFinite(xMax)) xMax = 100;
    if (yMax === 0) yMax = 10;

    // Render X axes (linear scale for histogram)
    this.xAxes().forEach((xAxis) => {
      if (xAxis.hide()) return;

      const userDomain = xAxis.domain();
      let domain: [number, number];
      if (userDomain[0] !== 'auto' && userDomain[0] !== 'dataMin') {
        domain = userDomain as [number, number];
      } else {
        domain = [xMin, xMax];
      }

      const scale = createLinearScale(domain, innerWidth, false);
      this.chartContext.registerXScale(scale, xAxis.axisId());
      renderXAxis(this.axesLayer!, xAxis, scale, innerHeight);
    });

    // Render Y axes (linear scale for count)
    this.yAxes().forEach((yAxis) => {
      if (yAxis.hide()) return;

      const userDomain = yAxis.domain();
      let domain: [number, number];
      if (userDomain[0] !== 'auto' && userDomain[0] !== 'dataMin') {
        domain = userDomain as [number, number];
      } else {
        domain = [0, yMax];
      }

      const scale = createLinearScale(domain, innerHeight, true);
      this.chartContext.registerYScale(scale, yAxis.axisId());
      renderYAxis(this.axesLayer!, yAxis, scale, innerWidth);
    });
  }

  private renderHistogramBars(): void {
    if (!this.barsLayer) return;

    const xScale = this.chartContext.xScale();
    const yScale = this.chartContext.yScale();
    if (!xScale || !yScale) return;

    if (!isLinearScale(xScale) || !isLinearScale(yScale)) return;

    const innerHeight = this.chartContext.innerHeight();

    this.histograms().forEach((histogram) => {
      if (histogram.hide()) return;

      const bins = this.computedBins.get(histogram);
      if (!bins || bins.length === 0) return;

      const barsGroup = d3
        .select(this.barsLayer!)
        .append('g')
        .attr('class', `histogram-${histogram.dataKey()}`);

      bins.forEach((bin, index) => {
        const x = xScale(bin.x0);
        const width = xScale(bin.x1) - xScale(bin.x0);
        const y = yScale(bin.length);
        const height = innerHeight - y;

        // Skip empty bins or invalid dimensions
        if (width <= 0 || height < 0) return;

        const rect = barsGroup.append('rect');

        rect
          .attr('class', `histogram-bar histogram-bar-${index}`)
          .attr('x', x)
          .attr('y', y)
          .attr('fill', histogram.fill())
          .attr('opacity', histogram.opacity())
          .style('cursor', 'pointer');

        const stroke = histogram.stroke();
        if (stroke) {
          rect.attr('stroke', stroke).attr('stroke-width', histogram.strokeWidth());
        }

        // Animation
        if (histogram.isAnimationActive()) {
          rect
            .attr('width', width)
            .attr('height', 0)
            .attr('y', innerHeight)
            .transition()
            .duration(histogram.animationDuration())
            .delay(index * 30) // Stagger animation
            .ease(d3.easeQuadOut)
            .attr('height', height)
            .attr('y', y);
        } else {
          rect.attr('width', width).attr('height', height);
        }
      });
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
      this.chartContext as ChartContextService<unknown>,
      isFront
    );
  }

  // Mouse interaction handlers
  onChartMouseMove(event: MouseEvent): void {
    if (!this.barsLayer) return;

    const [mouseX] = d3.pointer(event, this.barsLayer);
    const xScale = this.chartContext.xScale();
    const yScale = this.chartContext.yScale();

    if (!xScale || !yScale) return;
    if (!isLinearScale(xScale)) return;

    // Find which bin the mouse is over
    const xValue = xScale.invert(mouseX);

    const result = this.findBinAtPosition(xValue);

    if (!result) {
      clearTooltip(this.chartContext as ChartContextService<unknown>);
      return;
    }

    const { bin, histogram } = result;

    // Calculate tooltip position (center of the bin)
    const binCenterX = xScale(bin.x0 + (bin.x1 - bin.x0) / 2);
    const binTopY = isLinearScale(yScale) ? yScale(bin.length) : 0;

    const position = { x: binCenterX, y: binTopY };

    // Build tooltip payload
    const payload = [{
      name: histogram.name() || String(histogram.dataKey()),
      value: bin.length,
      dataKey: histogram.dataKey(),
      color: histogram.fill(),
      payload: {
        x0: bin.x0,
        x1: bin.x1,
        count: bin.length,
      },
    }];

    // Format bin range as label
    const label = `${bin.x0.toFixed(1)} - ${bin.x1.toFixed(1)}`;

    updateTooltip(
      this.chartContext as ChartContextService<unknown>,
      0, // dataIndex not meaningful for histograms
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
  }

  private findBinAtPosition(xValue: number): { bin: HistogramBin; histogram: SpnHistogram } | null {
    for (const [histogram, bins] of this.computedBins.entries()) {
      for (const bin of bins) {
        if (xValue >= bin.x0 && xValue < bin.x1) {
          return { bin, histogram };
        }
      }
    }
    return null;
  }

  onChartMouseLeave(): void {
    clearTooltip(this.chartContext as ChartContextService<unknown>);
  }
}
