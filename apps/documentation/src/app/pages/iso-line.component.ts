import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  CurveType,
  SpnCartesianGrid,
  SpnLine,
  SpnLineChart,
  SpnTooltip,
  SpnTooltipContentDef,
  SpnXAxis,
  SpnYAxis,
} from '@spartan-ng/charts';
import { INTERACTIVE_DATA } from './interactive-data';

interface LineSeries {
  dataKey: string;
  name: string;
  color: string;
  dot?: boolean;
  dotSize?: number;
  activeDotSize?: number;
}
interface LineMargin { top: number; right: number; bottom: number; left: number }
interface LineVariant {
  curve: CurveType;
  hideLabel: boolean;
  series: LineSeries[];
  margin?: LineMargin;
  labels?: boolean;
  dataset?: 'months' | 'browser' | 'interactive';
  categoryKey?: string;
  dateAxis?: boolean;
  hideCategoryAxis?: boolean;
  yDomain?: [number, number];
  indicator?: 'dot' | 'line';
  labelDataKey?: string;
}

const DESKTOP: LineSeries = { dataKey: 'desktop', name: 'Desktop', color: 'var(--chart-1)' };
const MOBILE: LineSeries = { dataKey: 'mobile', name: 'Mobile', color: 'var(--chart-2)' };
const VISITORS: LineSeries = { dataKey: 'visitors', name: 'Visitors', color: 'var(--chart-2)' };

export const LINE_BROWSER_LABELS: Record<string, string> = {
  chrome: 'Chrome', safari: 'Safari', firefox: 'Firefox', edge: 'Edge', other: 'Other',
};
export const LINE_BROWSER_DATA = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
];

export const LINE_VARIANTS: Record<string, LineVariant> = {
  default: { curve: 'natural', hideLabel: true, series: [DESKTOP] },
  linear: { curve: 'linear', hideLabel: true, series: [DESKTOP] },
  multiple: { curve: 'monotoneX', hideLabel: false, series: [DESKTOP, MOBILE] },
  dots: {
    curve: 'natural',
    hideLabel: true,
    series: [{ ...DESKTOP, dot: true, dotSize: 4, activeDotSize: 6 }],
  },
  label: {
    curve: 'natural',
    hideLabel: false,
    labels: true,
    margin: { top: 20, right: 12, bottom: 30, left: 12 },
    series: [{ ...DESKTOP, dot: true, dotSize: 4, activeDotSize: 6 }],
  },
  step: { curve: 'step', hideLabel: true, series: [DESKTOP] },
  interactive: {
    curve: 'natural',
    hideLabel: false,
    dataset: 'interactive',
    categoryKey: 'date',
    dateAxis: true,
    yDomain: [0, 600],
    series: [DESKTOP],
  },
  'custom-label': {
    curve: 'natural',
    hideLabel: true,
    labels: true,
    dataset: 'browser',
    categoryKey: 'browser',
    hideCategoryAxis: true,
    indicator: 'line',
    labelDataKey: 'browser',
    margin: { top: 24, right: 24, bottom: 12, left: 24 },
    yDomain: [0, 280],
    series: [{ ...VISITORS, dot: true, dotSize: 4, activeDotSize: 6 }],
  },
};

export const LINE_DATA = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

/** Bare, chrome-less render of a shadcn line chart variant for pixel-diff capture. */
@Component({
  selector: 'app-iso-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SpnLineChart,
    SpnXAxis,
    SpnYAxis,
    SpnLine,
    SpnCartesianGrid,
    SpnTooltip,
    SpnTooltipContentDef,
  ],
  host: { class: 'iso-root' },
  template: `
    <div class="iso-chart" [style.width.px]="w()" [style.height.px]="h()" [attr.data-ready]="true">
      <spn-line-chart
        [data]="chartData()"
        [width]="w()"
        [height]="h()"
        [responsive]="false"
        [margin]="margin()"
      >
        <spn-cartesian-grid [vertical]="false" strokeDasharray="0" stroke="hsl(var(--border) / 0.5)" [strokeWidth]="1" />
        <spn-x-axis
          [dataKey]="categoryKey()"
          [axisLine]="false"
          [tickLine]="false"
          [tickSize]="0"
          [tickPadding]="14"
          [tickFormatter]="cfg().hideCategoryAxis ? emptyTick : formatCategory"
          [minTickGap]="cfg().dateAxis ? 32 : 0"
          stroke="hsl(var(--muted-foreground))"
        />
        <spn-y-axis [domain]="yDomain()" [tickFormatter]="emptyTick" [axisLine]="false" [tickLine]="false" [tickSize]="0" stroke="transparent" />
        @for (s of cfg().series; track s.dataKey) {
          <spn-line
            [dataKey]="s.dataKey"
            [name]="s.name"
            [curve]="cfg().curve"
            [stroke]="s.color"
            [strokeWidth]="2"
            [dot]="s.dot ?? false"
            [dotSize]="s.dotSize ?? 4"
            [dotFill]="s.color"
            dotStroke="transparent"
            [dotStrokeWidth]="0"
            [activeDot]="true"
            [activeDotSize]="s.activeDotSize ?? 4"
            [activeDotFill]="s.color"
            activeDotStroke="transparent"
            [activeDotStrokeWidth]="0"
            [isAnimationActive]="false"
          />
        }
        <spn-tooltip [cursor]="false">
          <ng-template spnTooltipContent let-state>
            <div class="spn-shadcn-tooltip">
              @if (!cfg().hideLabel) {
                <div class="tlabel">{{ formatLabel(state.label) }}</div>
              }
              @for (item of state.payload; track item.dataKey) {
                <div class="row" [class.row-dot]="indicator() === 'dot'">
                  <span class="indicator" [class.dot]="indicator() === 'dot'" [class.line]="indicator() === 'line'" [style.background]="item.color"></span>
                  <div class="body">
                    <div class="labels"><span class="name">{{ item.name }}</span></div>
                    <span class="value">{{ item.value }}</span>
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </spn-tooltip>
      </spn-line-chart>
      @if (cfg().labels) {
        <svg class="line-label-overlay" [attr.width]="w()" [attr.height]="h()">
          @for (point of labelPoints(); track point.key) {
            <text [attr.x]="point.x" [attr.y]="point.y" text-anchor="middle">{{ point.label }}</text>
          }
        </svg>
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
      spn-line-chart { display: block; }
      ::ng-deep .spn-line-chart,
      ::ng-deep .spn-line-chart text {
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .line-label-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: visible;
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 12px;
        fill: hsl(var(--foreground));
      }
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
      ::ng-deep .spn-shadcn-tooltip .tlabel { font-weight: 500; }
      ::ng-deep .spn-shadcn-tooltip .row { display: flex; width: 100%; align-items: stretch; gap: 0.5rem; }
      ::ng-deep .spn-shadcn-tooltip .row-dot { align-items: center; }
      ::ng-deep .spn-shadcn-tooltip .indicator { flex-shrink: 0; }
      ::ng-deep .spn-shadcn-tooltip .indicator.dot { width: 0.625rem; height: 0.625rem; border-radius: 2px; }
      ::ng-deep .spn-shadcn-tooltip .indicator.line { width: 0.25rem; align-self: stretch; border-radius: 2px; }
      ::ng-deep .spn-shadcn-tooltip .body { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 0.5rem; line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .name { color: hsl(var(--muted-foreground)); line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .value {
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1; color: hsl(var(--foreground));
      }
    `,
  ],
})
export class IsoLineComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected w = () => Number(this.params().get('w')) || 600;
  protected h = () => Number(this.params().get('h')) || 300;
  protected readonly cfg = computed(
    () => LINE_VARIANTS[this.params().get('chart') ?? 'default'] ?? LINE_VARIANTS['default'],
  );
  protected readonly margin = computed(
    () => this.cfg().margin ?? { top: 12, right: 12, bottom: 30, left: 12 },
  );
  protected readonly indicator = computed(() => this.cfg().indicator ?? 'dot');
  protected readonly categoryKey = computed(() => this.cfg().categoryKey ?? 'month');
  protected readonly chartData = computed<unknown[]>(() => {
    const ds = this.cfg().dataset;
    if (ds === 'browser') return LINE_BROWSER_DATA;
    if (ds === 'interactive') return INTERACTIVE_DATA as unknown[];
    return LINE_DATA;
  });
  protected readonly yDomain = computed(() => this.cfg().yDomain ?? [0, 320] as [number, number]);
  protected readonly labelPoints = computed(() => {
    const margin = this.margin();
    const innerWidth = this.w() - margin.left - margin.right;
    const innerHeight = this.h() - margin.top - margin.bottom;
    const data = this.chartData() as Record<string, unknown>[];
    const seriesKey = this.cfg().series[0]?.dataKey ?? 'desktop';
    const labelKey = this.cfg().labelDataKey ?? seriesKey;
    const [yMin, yMax] = this.yDomain();
    return data.map((point, index) => ({
      key: `${point[this.categoryKey()]}-${index}`,
      label: this.formatPointLabel(point[labelKey]),
      x: margin.left + (index * innerWidth) / Math.max(data.length - 1, 1),
      y: margin.top + ((yMax - Number(point[seriesKey])) / (yMax - yMin)) * innerHeight - 12,
    }));
  });
  protected readonly formatMonth = (value: unknown): string => String(value).slice(0, 3);
  protected readonly formatDate = (value: unknown): string =>
    new Date(String(value)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  protected readonly formatCategory = (value: unknown): string => {
    if (this.cfg().dataset === 'interactive') return this.formatDate(value);
    return this.formatMonth(value);
  };
  protected readonly formatLabel = (value: unknown): string =>
    this.cfg().dateAxis ? this.formatDate(value) : String(value);
  protected readonly formatPointLabel = (value: unknown): string => {
    if (this.cfg().labelDataKey === 'browser') return LINE_BROWSER_LABELS[String(value)] ?? String(value);
    return String(value);
  };
  protected readonly emptyTick = (): string => '';
}
