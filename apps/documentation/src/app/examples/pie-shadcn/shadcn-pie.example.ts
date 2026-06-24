import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { SpnPie, SpnPieChart, SpnTooltip, SpnTooltipContentDef } from '@spartan-ng/charts';
import { chartComponentTs } from '../../components/code-snippet.util';
import {
  PIE_COLORS,
  PIE_DATA,
  PIE_LABELS,
  PIE_LEGEND_HEIGHT,
  PIE_STACKED_DESKTOP_DATA,
  PIE_STACKED_MOBILE_DATA,
  PIE_VARIANTS,
} from '../../pages/iso-pie.component';

/** Faithful shadcn pie chart, variant-driven, sized to its container. */
@Component({
  selector: 'app-shadcn-pie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpnPieChart, SpnPie, SpnTooltip, SpnTooltipContentDef],
  styles: [
    `
      :host { display: block; width: 100%; min-width: 0; }
      .chart-box { position: relative; width: 100%; overflow: hidden; }
      /* The chart svg + overlays are a fixed size; centre them in the card. */
      spn-pie-chart { position: absolute; top: 0; left: 0; right: 0; display: block; }
      ::ng-deep .spn-pie-chart {
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      ::ng-deep svg.spn-pie-chart { display: block; margin-inline: auto; }
      .center-label, .active-sector-overlay { position: absolute; top: 0; left: 50%; transform: translateX(-50%); pointer-events: none; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
      .center-value { fill: hsl(var(--foreground)); font-size: 1.875rem; font-weight: 700; }
      .center-caption { fill: hsl(var(--muted-foreground)); font-size: 1rem; }
      .spn-legend-row { position: absolute; left: 5px; right: 5px; top: calc(100% - 5.3125rem); display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding-top: 0.75rem; flex-wrap: wrap; transform: translateY(-0.5rem); }
      .spn-legend-row .legend-item { display: flex; flex: 0 0 25%; align-items: center; justify-content: center; gap: 0.375rem; }
      .spn-legend-row .swatch { width: 0.5rem; height: 0.5rem; border-radius: 2px; flex-shrink: 0; }
      .spn-legend-row .legend-label { color: hsl(var(--foreground)); font-size: 0.75rem; line-height: 1; }
    `,
  ],
  template: `
    <div class="chart-box" [style.height.px]="height()">
    <spn-pie-chart
      [data]="chartData()"
      [width]="width()"
      [height]="chartHeight()"
      [responsive]="false"
      [margin]="{ top: 5, right: 5, bottom: 5, left: 5 }"
    >
      @if (cfg().stacked) {
        <spn-pie [data]="PIE_STACKED_DESKTOP_DATA" dataKey="desktop" nameKey="month" [colors]="PIE_COLORS" [outerRadius]="60" [startAngle]="90" [endAngle]="-270" stroke="hsl(var(--background))" [strokeWidth]="1" [isAnimationActive]="true" />
        <spn-pie [data]="PIE_STACKED_MOBILE_DATA" dataKey="mobile" nameKey="month" [colors]="PIE_COLORS" [innerRadius]="70" [outerRadius]="90" [startAngle]="90" [endAngle]="-270" stroke="hsl(var(--background))" [strokeWidth]="1" [isAnimationActive]="true" />
      } @else {
        <spn-pie
          dataKey="visitors"
          nameKey="browser"
          [colors]="colors()"
          [innerRadius]="cfg().innerRadius ?? 0"
          outerRadius="80%"
          [startAngle]="90"
          [endAngle]="-270"
          [stroke]="cfg().stroke ?? 'hsl(var(--background))'"
          [strokeWidth]="cfg().strokeWidth ?? 1"
          [label]="cfg().label ?? false"
          [labelLine]="cfg().labelLine ?? false"
          [isAnimationActive]="true"
          [dataKey]="dataKey()"
          [nameKey]="nameKey()"
        />
      }
      @if (!cfg().legend) {
        <spn-tooltip [cursor]="false">
          <ng-template spnTooltipContent let-state>
            <div class="spn-shadcn-tooltip">
              @for (item of state.payload; track item.name) {
                <div class="row row-dot">
                  <span class="indicator dot" [style.background]="item.color"></span>
                  <div class="body">
                    <div class="labels"><span class="name">{{ formatBrowser(item.name) }}</span></div>
                    <span class="value">{{ item.value }}</span>
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </spn-tooltip>
      }
    </spn-pie-chart>
    @if (cfg().centerText) {
      <svg class="center-label" [attr.width]="width()" [attr.height]="chartHeight()">
        <text [attr.x]="width() / 2" [attr.y]="chartHeight() / 2" text-anchor="middle" dominant-baseline="middle">
          <tspan class="center-value" [attr.x]="width() / 2" [attr.y]="chartHeight() / 2">{{ centerValue() }}</tspan>
          <tspan class="center-caption" [attr.x]="width() / 2" [attr.y]="chartHeight() / 2 + 24">Visitors</tspan>
        </text>
      </svg>
    }
    @if (activeSectorPath()) {
      <svg class="active-sector-overlay" [attr.width]="width()" [attr.height]="chartHeight()">
        <path [attr.d]="activeSectorPath()" [attr.fill]="activeSectorFill()" stroke="hsl(var(--background))" [attr.stroke-width]="cfg().strokeWidth ?? 1"></path>
        @if (activeRingPath()) {
          <path [attr.d]="activeRingPath()" [attr.fill]="activeSectorFill()" stroke="hsl(var(--background))" [attr.stroke-width]="cfg().strokeWidth ?? 1"></path>
        }
      </svg>
    }
    @if (cfg().legend) {
      <div class="spn-legend-row">
        @for (item of chartData(); track item['browser']) {
          <div class="legend-item">
            <span class="swatch" [style.background]="item.fill"></span>
            <span class="legend-label">{{ formatBrowser(item['browser']) }}</span>
          </div>
        }
      </div>
    }
    </div>
  `,
})
export class ShadcnPieExampleComponent {
  readonly variant = input<string>('simple');
  protected readonly cfg = computed(
    () => PIE_VARIANTS[this.variant()] ?? PIE_VARIANTS['simple'],
  );

  /** Representative Spartan usage for the current variant (View Code). */
  protected readonly code = computed(() => {
    const c = this.cfg();
    const attrs = [
      `dataKey="${c.dataKey ?? 'visitors'}"`,
      `nameKey="${c.nameKey ?? 'browser'}"`,
      c.innerRadius ? `[innerRadius]="${c.innerRadius}"` : '',
      c.label ? 'label' : '',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      '<spn-pie-chart [data]="data">\n' +
      `  <spn-pie ${attrs} />\n` +
      '  <spn-tooltip />\n' +
      '</spn-pie-chart>'
    );
  });

  readonly tsCode = computed(() =>
    chartComponentTs(
      'app-pie-demo',
      ['SpnPieChart', 'SpnPie', 'SpnTooltip'],
      this.code(),
      this.chartData() as unknown[],
    ),
  );

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly width = signal(250);
  protected readonly height = signal(250);
  protected readonly PIE_COLORS = PIE_COLORS;
  protected readonly PIE_STACKED_DESKTOP_DATA = PIE_STACKED_DESKTOP_DATA;
  protected readonly PIE_STACKED_MOBILE_DATA = PIE_STACKED_MOBILE_DATA;

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      const apply = () => {
        const w = el.clientWidth;
        if (w > 0) {
          const size = Math.min(w, this.cfg().legend ? 300 : 250);
          this.width.set(size);
          this.height.set(size);
        }
      };
      apply();
      const ro = new ResizeObserver(apply);
      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  protected readonly chartHeight = computed(
    () => this.height() - (this.cfg().legend ? PIE_LEGEND_HEIGHT : 0),
  );
  protected readonly chartData = computed(() => this.cfg().data ?? PIE_DATA);
  protected readonly dataKey = computed(() => this.cfg().dataKey ?? 'visitors');
  protected readonly nameKey = computed(() => this.cfg().nameKey ?? 'browser');
  protected readonly colors = computed(() => this.chartData().map((item) => String(item.fill)));
  protected readonly totalVisitors = computed(() =>
    this.chartData()
      .reduce((total, item) => total + Number(item[this.dataKey()] ?? 0), 0)
      .toLocaleString(),
  );
  protected readonly centerValue = computed(() => {
    const active = this.cfg().activeSector;
    if (!this.cfg().activeRing || !active) return this.totalVisitors();
    const item = this.chartData().find((entry) => entry[this.nameKey()] === active);
    return Number(item?.[this.dataKey()] ?? 0).toLocaleString();
  });
  protected readonly formatBrowser = (value: unknown): string =>
    PIE_LABELS[String(value)] ?? String(value);
  protected readonly activeSectorFill = computed(() => {
    const active = this.cfg().activeSector;
    return String(
      this.chartData().find((item) => item[this.nameKey()] === active)?.fill ?? 'var(--chart-1)',
    );
  });
  protected readonly activeSectorPath = computed(() => this.sectorPath(10));
  protected readonly activeRingPath = computed(() =>
    this.cfg().activeRing ? this.sectorPath(25, 12, true) : '',
  );

  private sectorPath(outerOffset: number, innerOffset = 0, ring = false): string {
    const active = this.cfg().activeSector;
    if (!active) return '';
    const data = this.chartData();
    const key = this.dataKey();
    const nameKey = this.nameKey();
    const index = data.findIndex((item) => item[nameKey] === active);
    if (index < 0) return '';
    const total = data.reduce((sum, item) => sum + Number(item[key] ?? 0), 0);
    if (total <= 0) return '';
    let angle = 90;
    for (let i = 0; i < index; i++) {
      angle -= (360 * Number(data[i][key] ?? 0)) / total;
    }
    const endAngle = angle - (360 * Number(data[index][key] ?? 0)) / total;
    const maxRadius = (Math.min(this.width() - 10, this.chartHeight() - 10) / 2) * 0.8;
    const innerBase = ring ? maxRadius : (this.cfg().innerRadius ?? 0);
    return this.arcPath(angle, endAngle, innerBase + innerOffset, maxRadius + outerOffset);
  }

  private arcPath(startDeg: number, endDeg: number, innerRadius: number, outerRadius: number): string {
    const cx = this.width() / 2;
    const cy = this.chartHeight() / 2;
    const point = (deg: number, radius: number) => {
      const rad = (deg * Math.PI) / 180;
      return [cx + Math.sin(rad) * radius, cy - Math.cos(rad) * radius];
    };
    const [sx, sy] = point(startDeg, outerRadius);
    const [ex, ey] = point(endDeg, outerRadius);
    const [isx, isy] = point(startDeg, innerRadius);
    const [iex, iey] = point(endDeg, innerRadius);
    const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return [
      `M ${sx} ${sy}`,
      `A ${outerRadius} ${outerRadius} 0 ${large} 0 ${ex} ${ey}`,
      `L ${iex} ${iey}`,
      `A ${innerRadius} ${innerRadius} 0 ${large} 1 ${isx} ${isy}`,
      'Z',
    ].join(' ');
  }
}
