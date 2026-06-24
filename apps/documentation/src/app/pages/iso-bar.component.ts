import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SpnBarChart,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
  SpnCartesianGrid,
  SpnTooltip,
  SpnTooltipContentDef,
} from '@spartan-ng/charts';
import { INTERACTIVE_DATA } from './interactive-data';

interface BarLabel { offset?: number; fontSize?: number; fill?: string; dataKey?: string; position?: 'top' | 'insideLeft' | 'right' }
interface BarSeries {
  dataKey: string;
  name: string;
  color: string;
  radius: number | [number, number, number, number];
  label?: BarLabel | BarLabel[];
  stackId?: string;
  activeIndex?: number;
  activeStrokeDasharray?: string;
}
interface BarMargin { top: number; right: number; bottom: number; left: number }
interface BarVariant {
  hideLabel: boolean;
  series: BarSeries[];
  layout?: 'vertical' | 'horizontal';
  indicator?: 'dot' | 'dashed' | 'line';
  margin?: BarMargin;
  legend?: boolean;
  dataset?: 'months' | 'browser' | 'negative' | 'interactive';
  categoryKey?: string;
  hideIndicator?: boolean;
  hideCategoryAxis?: boolean;
  dateAxis?: boolean;
}

const VISITORS = { dataKey: 'visitors', name: 'Visitors', color: 'var(--chart-1)' };
export const BROWSER_LABELS: Record<string, string> = {
  chrome: 'Chrome', safari: 'Safari', firefox: 'Firefox', edge: 'Edge', other: 'Other',
};
export const BROWSER_DATA = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
];
const POS = 'var(--chart-1)';
const NEG = 'var(--chart-2)';
export const NEGATIVE_DATA = [
  { month: 'January', visitors: 186, fill: POS },
  { month: 'February', visitors: 205, fill: POS },
  { month: 'March', visitors: -207, fill: NEG },
  { month: 'April', visitors: 173, fill: POS },
  { month: 'May', visitors: -209, fill: NEG },
  { month: 'June', visitors: 214, fill: POS },
];

// recharts reserves this much vertical space for the legend row.
export const BAR_LEGEND_HEIGHT = 24;

const DESKTOP: BarSeries = { dataKey: 'desktop', name: 'Desktop', color: 'var(--chart-1)', radius: 8 };
const MOBILE: BarSeries = { dataKey: 'mobile', name: 'Mobile', color: 'var(--chart-2)', radius: 8 };

export const BAR_VARIANTS: Record<string, BarVariant> = {
  default: { hideLabel: true, series: [DESKTOP] },
  horizontal: {
    hideLabel: true,
    layout: 'horizontal',
    margin: { top: 12, right: 12, bottom: 12, left: 40 },
    series: [{ ...DESKTOP, radius: 5 }],
  },
  multiple: {
    hideLabel: false,
    indicator: 'dashed',
    series: [
      { ...DESKTOP, radius: 4 },
      { ...MOBILE, radius: 4 },
    ],
  },
  label: {
    hideLabel: true,
    margin: { top: 20, right: 12, bottom: 30, left: 12 },
    series: [{ ...DESKTOP, radius: 8, label: { offset: 12, fontSize: 12, fill: 'hsl(var(--foreground))' } }],
  },
  stacked: {
    hideLabel: true,
    legend: true,
    series: [
      { ...DESKTOP, radius: [0, 0, 4, 4], stackId: 'a' },
      { ...MOBILE, radius: [4, 4, 0, 0], stackId: 'a' },
    ],
  },
  mixed: {
    hideLabel: true,
    layout: 'horizontal',
    dataset: 'browser',
    categoryKey: 'browser',
    margin: { top: 12, right: 12, bottom: 12, left: 60 },
    series: [{ ...VISITORS, radius: 5 }],
  },
  negative: {
    hideLabel: true,
    hideIndicator: true,
    hideCategoryAxis: true,
    dataset: 'negative',
    margin: { top: 24, right: 12, bottom: 24, left: 12 },
    series: [
      { ...VISITORS, radius: 4, label: { dataKey: 'month', offset: 8, fontSize: 12 } },
    ],
  },
  active: {
    hideLabel: true,
    dataset: 'browser',
    categoryKey: 'browser',
    series: [{ ...VISITORS, radius: 8, activeIndex: 2, activeStrokeDasharray: '4' }],
  },
  'label-custom': {
    hideLabel: false,
    indicator: 'line',
    layout: 'horizontal',
    hideCategoryAxis: true,
    margin: { top: 12, right: 28, bottom: 12, left: 6 },
    series: [
      {
        dataKey: 'desktop',
        name: 'Desktop',
        color: 'var(--chart-2)',
        radius: 4,
        label: [
          { dataKey: 'month', position: 'insideLeft', offset: 8, fontSize: 12, fill: 'hsl(var(--background))' },
          { dataKey: 'desktop', position: 'right', offset: 8, fontSize: 12, fill: 'hsl(var(--foreground))' },
        ],
      },
    ],
  },
  interactive: {
    hideLabel: false,
    dataset: 'interactive',
    categoryKey: 'date',
    dateAxis: true,
    margin: { top: 12, right: 12, bottom: 30, left: 12 },
    series: [{ ...DESKTOP, radius: 0 }],
  },
};

export const BAR_DATA = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

/** Bare, chrome-less render of a shadcn bar chart variant for pixel-diff capture. */
@Component({
  selector: 'app-iso-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef],
  host: { class: 'iso-root' },
  template: `
    <div class="iso-chart" [style.width.px]="w()" [style.height.px]="h()" [attr.data-ready]="true">
      <spn-bar-chart
        [data]="chartData()"
        [width]="w()"
        [height]="chartHeight()"
        [responsive]="false"
        [margin]="margin()"
        [layout]="cfg().layout ?? 'vertical'"
      >
        @if (cfg().layout === 'horizontal') {
          <spn-y-axis
            [dataKey]="categoryKey()"
            [axisLine]="false"
            [tickLine]="false"
            [tickSize]="0"
            [tickPadding]="10"
            [tickFormatter]="cfg().hideCategoryAxis ? emptyFormatter : formatCategory"
            stroke="hsl(var(--muted-foreground))"
          />
        } @else {
          <spn-cartesian-grid [vertical]="false" strokeDasharray="0" stroke="hsl(var(--border) / 0.5)" [strokeWidth]="1" />
          <!-- Always present (provides the category band scale); labels hidden via
               an empty formatter when the variant draws no category axis. -->
          <spn-x-axis
            [dataKey]="categoryKey()"
            [axisLine]="false"
            [tickLine]="false"
            [tickSize]="0"
            [tickPadding]="10"
            [minTickGap]="cfg().dateAxis ? 32 : 0"
            [tickFormatter]="cfg().hideCategoryAxis ? emptyFormatter : formatCategory"
            stroke="hsl(var(--muted-foreground))"
          />
        }
        @for (s of cfg().series; track s.dataKey) {
          <spn-bar
            [dataKey]="s.dataKey"
            [name]="s.name"
            [fill]="s.color"
            [radius]="s.radius"
            [label]="s.label ?? false"
            [stackId]="s.stackId"
            [activeIndex]="s.activeIndex ?? -1"
            [activeStrokeDasharray]="s.activeStrokeDasharray"
            [isAnimationActive]="false"
          />
        }
        <spn-tooltip [cursor]="false">
          <ng-template spnTooltipContent let-state>
            <div class="spn-shadcn-tooltip">
              @if (showTopLabel()) {
                <div class="tlabel">{{ cfg().dateAxis ? formatDate(state.label) : state.label }}</div>
              }
              @for (item of state.payload; track item.dataKey) {
                <div class="row" [class.row-dot]="indicator() !== 'line'">
                  @if (!cfg().hideIndicator) {
                    <span class="indicator" [class.dot]="indicator() === 'dot'" [class.dashed]="indicator() === 'dashed'" [class.line]="indicator() === 'line'" [style.background]="indicator() === 'dashed' ? 'transparent' : item.color" [style.border-color]="item.color"></span>
                  }
                  <div class="body" [class.nest]="nestLabel()">
                    <div class="labels">
                      @if (nestLabel()) {
                        <span class="label">{{ state.label }}</span>
                      }
                      <span class="name">{{ item.name }}</span>
                    </div>
                    <span class="value">{{ item.value }}</span>
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </spn-tooltip>
      </spn-bar-chart>
      @if (cfg().legend) {
        <div class="spn-legend-row">
          @for (s of cfg().series; track s.dataKey) {
            <div class="legend-item">
              <span class="swatch" [style.background]="s.color"></span>
              <span class="legend-label">{{ s.name }}</span>
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
        background: hsl(var(--card));
        font-size: 12px;
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      spn-bar-chart { display: block; }
      .spn-legend-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding-top: 0.75rem;
      }
      .spn-legend-row .legend-item { display: flex; align-items: center; gap: 0.375rem; }
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
      ::ng-deep .spn-shadcn-tooltip .tlabel { font-weight: 500; }
      ::ng-deep .spn-shadcn-tooltip .row { display: flex; width: 100%; align-items: stretch; gap: 0.5rem; }
      ::ng-deep .spn-shadcn-tooltip .row-dot { align-items: center; }
      ::ng-deep .spn-shadcn-tooltip .indicator { flex-shrink: 0; }
      ::ng-deep .spn-shadcn-tooltip .indicator.dot { width: 0.625rem; height: 0.625rem; border-radius: 2px; }
      ::ng-deep .spn-shadcn-tooltip .indicator.dashed { width: 0; height: 0.75rem; border-width: 1.5px; border-style: dashed; align-self: center; }
      ::ng-deep .spn-shadcn-tooltip .indicator.line { width: 0.25rem; align-self: stretch; border-radius: 2px; }
      ::ng-deep .spn-shadcn-tooltip .body { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 0.5rem; line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .body.nest { align-items: flex-end; }
      ::ng-deep .spn-shadcn-tooltip .labels { display: grid; gap: 0.375rem; }
      ::ng-deep .spn-shadcn-tooltip .label { font-weight: 500; color: hsl(var(--foreground)); }
      ::ng-deep .spn-shadcn-tooltip .name { color: hsl(var(--muted-foreground)); line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .value {
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1; color: hsl(var(--foreground));
      }
    `,
  ],
})
export class IsoBarComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected w = () => Number(this.params().get('w')) || 600;
  protected h = () => Number(this.params().get('h')) || 300;
  protected readonly cfg = computed(
    () => BAR_VARIANTS[this.params().get('chart') ?? 'default'] ?? BAR_VARIANTS['default'],
  );

  protected readonly indicator = computed(() => this.cfg().indicator ?? 'dot');
  // shadcn nests the label beside a full-height line indicator for a single series.
  protected readonly nestLabel = computed(
    () => this.cfg().series.length === 1 && this.indicator() === 'line',
  );
  protected readonly showTopLabel = computed(
    () => !this.cfg().hideLabel && !this.nestLabel(),
  );
  protected readonly categoryKey = computed(() => this.cfg().categoryKey ?? 'month');
  protected readonly chartHeight = computed(
    () => this.h() - (this.cfg().legend ? BAR_LEGEND_HEIGHT : 0),
  );
  protected readonly margin = computed(
    () => this.cfg().margin ?? { top: 12, right: 12, bottom: 30, left: 12 },
  );
  protected readonly chartData = computed<unknown[]>(() => {
    const ds = this.cfg().dataset;
    if (ds === 'browser') return BROWSER_DATA;
    if (ds === 'negative') return NEGATIVE_DATA;
    if (ds === 'interactive') return INTERACTIVE_DATA as unknown[];
    return BAR_DATA;
  });
  protected readonly emptyFormatter = (): string => '';
  protected readonly formatMonth = (value: unknown): string => String(value).slice(0, 3);
  protected readonly formatDate = (value: unknown): string =>
    new Date(String(value)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  protected readonly formatCategory = (value: unknown): string => {
    const ds = this.cfg().dataset;
    if (ds === 'browser') return BROWSER_LABELS[String(value)] ?? String(value);
    if (ds === 'interactive') return this.formatDate(value);
    return String(value).slice(0, 3);
  };
}
