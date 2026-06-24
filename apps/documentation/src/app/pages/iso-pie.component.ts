import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SpnPie,
  SpnPieChart,
  SpnTooltip,
  SpnTooltipContentDef,
  PieLabelConfig,
} from '@spartan-ng/charts';

export interface PieDatum {
  [key: string]: string | number;
  fill: string;
}

interface PieVariant {
  innerRadius?: number;
  strokeWidth?: number;
  stroke?: string;
  label?: boolean | PieLabelConfig;
  labelLine?: boolean;
  legend?: boolean;
  centerText?: boolean;
  activeSector?: 'chrome' | 'january';
  activeRing?: boolean;
  stacked?: boolean;
  data?: PieDatum[];
  dataKey?: string;
  nameKey?: string;
}

export const PIE_DATA: PieDatum[] = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
];

export const PIE_DONUT_TEXT_DATA: PieDatum[] = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 190, fill: 'var(--chart-5)' },
];

export const PIE_STACKED_DESKTOP_DATA: PieDatum[] = [
  { month: 'january', desktop: 186, fill: 'var(--chart-1)' },
  { month: 'february', desktop: 305, fill: 'var(--chart-2)' },
  { month: 'march', desktop: 237, fill: 'var(--chart-3)' },
  { month: 'april', desktop: 173, fill: 'var(--chart-4)' },
  { month: 'may', desktop: 209, fill: 'var(--chart-5)' },
];

export const PIE_STACKED_MOBILE_DATA: PieDatum[] = [
  { month: 'january', mobile: 80, fill: 'var(--chart-1)' },
  { month: 'february', mobile: 200, fill: 'var(--chart-2)' },
  { month: 'march', mobile: 120, fill: 'var(--chart-3)' },
  { month: 'april', mobile: 190, fill: 'var(--chart-4)' },
  { month: 'may', mobile: 130, fill: 'var(--chart-5)' },
];

export const PIE_INTERACTIVE_DATA = PIE_STACKED_DESKTOP_DATA;

export const PIE_LABELS: Record<string, string> = {
  chrome: 'Chrome',
  safari: 'Safari',
  firefox: 'Firefox',
  edge: 'Edge',
  other: 'Other',
};

export const PIE_COLORS = PIE_DATA.map((item) => item.fill);

export const PIE_VARIANTS: Record<string, PieVariant> = {
  simple: {},
  donut: { innerRadius: 60 },
  'donut-text': { innerRadius: 60, strokeWidth: 5, centerText: true, data: PIE_DONUT_TEXT_DATA },
  label: {
    label: {
      position: 'outside',
      formatter: (_value: number, name: string) => PIE_LABELS[name] ?? name,
      fill: 'hsl(var(--foreground))',
      fontSize: 12,
    },
  },
  legend: { legend: true },
  stacked: { stacked: true },
  'donut-active': { innerRadius: 60, strokeWidth: 5, activeSector: 'chrome' },
  'label-list': {
    label: {
      formatter: (_value: number, name: string) => PIE_LABELS[name] ?? name,
      fill: 'hsl(var(--background))',
      fontSize: 12,
    },
  },
  'label-custom': {
    label: {
      position: 'outside',
      formatter: (value: number) => String(value),
      fill: 'hsl(var(--foreground))',
      fontSize: 12,
    },
  },
  'separator-none': { stroke: '0', strokeWidth: 0 },
  interactive: {
    data: PIE_INTERACTIVE_DATA,
    dataKey: 'desktop',
    nameKey: 'month',
    innerRadius: 60,
    strokeWidth: 5,
    activeSector: 'january',
    activeRing: true,
    centerText: true,
  },
};

export const PIE_LEGEND_HEIGHT = 81;

/** Bare, chrome-less render of a shadcn pie chart variant for pixel-diff capture. */
@Component({
  selector: 'app-iso-pie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpnPieChart, SpnPie, SpnTooltip, SpnTooltipContentDef],
  host: { class: 'iso-root' },
  template: `
    <div class="iso-chart" [style.width.px]="w()" [style.height.px]="h()" [attr.data-ready]="true">
      <spn-pie-chart
        [data]="data()"
        [width]="w()"
        [height]="chartHeight()"
        [responsive]="false"
        [margin]="{ top: 5, right: 5, bottom: 5, left: 5 }"
      >
        @if (cfg().stacked) {
          <spn-pie
            [data]="PIE_STACKED_DESKTOP_DATA"
            dataKey="desktop"
            nameKey="month"
            [colors]="PIE_COLORS"
            [outerRadius]="60"
            [startAngle]="90"
            [endAngle]="-270"
            stroke="hsl(var(--background))"
            [strokeWidth]="1"
            [isAnimationActive]="false"
          />
          <spn-pie
            [data]="PIE_STACKED_MOBILE_DATA"
            dataKey="mobile"
            nameKey="month"
            [colors]="PIE_COLORS"
            [innerRadius]="70"
            [outerRadius]="90"
            [startAngle]="90"
            [endAngle]="-270"
            stroke="hsl(var(--background))"
            [strokeWidth]="1"
            [isAnimationActive]="false"
          />
        } @else {
          <spn-pie
            [dataKey]="dataKey()"
            [nameKey]="nameKey()"
            [colors]="colors()"
            [innerRadius]="cfg().innerRadius ?? 0"
            outerRadius="80%"
            [startAngle]="90"
            [endAngle]="-270"
            [stroke]="cfg().stroke ?? 'hsl(var(--background))'"
            [strokeWidth]="cfg().strokeWidth ?? 1"
            [label]="cfg().label ?? false"
            [labelLine]="cfg().labelLine ?? false"
            [isAnimationActive]="false"
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
        <svg class="center-label" [attr.width]="w()" [attr.height]="chartHeight()">
          <text [attr.x]="w() / 2" [attr.y]="chartHeight() / 2" text-anchor="middle" dominant-baseline="middle">
            <tspan class="center-value" [attr.x]="w() / 2" [attr.y]="chartHeight() / 2">{{ centerValue() }}</tspan>
            <tspan class="center-caption" [attr.x]="w() / 2" [attr.y]="chartHeight() / 2 + 24">Visitors</tspan>
          </text>
        </svg>
      }
      @if (activeSectorPath()) {
        <svg class="active-sector-overlay" [attr.width]="w()" [attr.height]="chartHeight()">
          <path [attr.d]="activeSectorPath()" [attr.fill]="activeSectorFill()" stroke="hsl(var(--background))" [attr.stroke-width]="cfg().strokeWidth ?? 1"></path>
          @if (activeRingPath()) {
            <path [attr.d]="activeRingPath()" [attr.fill]="activeSectorFill()" stroke="hsl(var(--background))" [attr.stroke-width]="cfg().strokeWidth ?? 1"></path>
          }
        </svg>
      }
      @if (cfg().legend) {
        <div class="spn-legend-row pie-legend">
          @for (item of PIE_DATA; track item['browser']) {
            <div class="legend-item">
              <span class="swatch" [style.background]="item.fill"></span>
              <span class="legend-label">{{ formatBrowser(item['browser']) }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; background: hsl(var(--card)); }
      .iso-chart {
        position: relative;
        background: hsl(var(--card));
        font-size: 12px;
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      spn-pie-chart { display: block; }
      .center-label,
      .active-sector-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .center-value { fill: hsl(var(--foreground)); font-size: 1.875rem; font-weight: 700; }
      .center-caption { fill: hsl(var(--muted-foreground)); font-size: 1rem; }
      ::ng-deep .spn-pie-chart {
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .spn-legend-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding-top: 0.75rem;
      }
      .pie-legend { position: absolute; left: 5px; right: 5px; top: calc(100% - 5.3125rem); flex-wrap: wrap; transform: translateY(-0.5rem); }
      .spn-legend-row .legend-item { display: flex; flex: 0 0 25%; align-items: center; justify-content: center; gap: 0.375rem; }
      .spn-legend-row .swatch { width: 0.5rem; height: 0.5rem; border-radius: 2px; flex-shrink: 0; }
      .spn-legend-row .legend-label { color: hsl(var(--foreground)); font-size: 0.75rem; line-height: 1; }

      ::ng-deep .spn-shadcn-tooltip {
        min-width: 8rem;
        display: grid;
        align-items: start;
        gap: 0.375rem;
        border-radius: 0.5rem;
        border: 1px solid hsl(var(--border) / 0.5);
        background: hsl(var(--background));
        padding: 0.375rem 0.625rem;
        font-size: 0.75rem;
        line-height: 1rem;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        color: hsl(var(--foreground));
      }
      ::ng-deep .spn-shadcn-tooltip .row { display: flex; width: 100%; align-items: stretch; gap: 0.5rem; }
      ::ng-deep .spn-shadcn-tooltip .row-dot { align-items: center; }
      ::ng-deep .spn-shadcn-tooltip .indicator { flex-shrink: 0; }
      ::ng-deep .spn-shadcn-tooltip .indicator.dot { width: 0.625rem; height: 0.625rem; border-radius: 2px; }
      ::ng-deep .spn-shadcn-tooltip .body { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 0.5rem; line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .name { color: hsl(var(--muted-foreground)); line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .value {
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1; color: hsl(var(--foreground));
      }
    `,
  ],
})
export class IsoPieComponent {
  protected readonly PIE_DATA = PIE_DATA;
  protected readonly PIE_STACKED_DESKTOP_DATA = PIE_STACKED_DESKTOP_DATA;
  protected readonly PIE_STACKED_MOBILE_DATA = PIE_STACKED_MOBILE_DATA;
  protected readonly PIE_COLORS = PIE_COLORS;
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected w = () => Number(this.params().get('w')) || 600;
  protected h = () => Number(this.params().get('h')) || 300;
  protected readonly cfg = computed(
    () => PIE_VARIANTS[this.params().get('chart') ?? 'simple'] ?? PIE_VARIANTS['simple'],
  );
  protected readonly data = computed(() => this.cfg().data ?? PIE_DATA);
  protected readonly dataKey = computed(() => this.cfg().dataKey ?? 'visitors');
  protected readonly nameKey = computed(() => this.cfg().nameKey ?? 'browser');
  protected readonly colors = computed(() => this.data().map((item) => String(item.fill)));
  protected readonly totalVisitors = computed(() =>
    this.data()
      .reduce((total, item) => total + Number(item[this.dataKey()] ?? 0), 0)
      .toLocaleString(),
  );
  protected readonly centerValue = computed(() => {
    const active = this.cfg().activeSector;
    if (!this.cfg().activeRing || !active) return this.totalVisitors();
    const item = this.data().find((entry) => entry[this.nameKey()] === active);
    return Number(item?.[this.dataKey()] ?? 0).toLocaleString();
  });
  protected readonly chartHeight = computed(
    () => this.h() - (this.cfg().legend ? PIE_LEGEND_HEIGHT : 0),
  );
  protected readonly formatBrowser = (value: unknown): string =>
    PIE_LABELS[String(value)] ?? String(value);
  protected readonly activeSectorFill = computed(() => {
    const active = this.cfg().activeSector;
    return String(
      this.data().find((item) => item[this.nameKey()] === active)?.fill ?? 'var(--chart-1)',
    );
  });
  protected readonly activeSectorPath = computed(() => this.sectorPath(10));
  protected readonly activeRingPath = computed(() =>
    this.cfg().activeRing ? this.sectorPath(25, 12, true) : '',
  );

  private sectorPath(outerOffset: number, innerOffset = 0, ring = false): string {
    const active = this.cfg().activeSector;
    if (!active) return '';
    const data = this.data();
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
    const maxRadius = (Math.min(this.w() - 10, this.chartHeight() - 10) / 2) * 0.8;
    const innerBase = ring ? maxRadius : (this.cfg().innerRadius ?? 0);
    return this.arcPath(angle, endAngle, innerBase + innerOffset, maxRadius + outerOffset);
  }

  private arcPath(startDeg: number, endDeg: number, innerRadius: number, outerRadius: number): string {
    const cx = this.w() / 2;
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
