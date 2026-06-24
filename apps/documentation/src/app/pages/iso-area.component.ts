import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp, lucideTrendingDown } from '@ng-icons/lucide';
import { INTERACTIVE_DATA } from './interactive-data';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
  SpnTooltip,
  SpnTooltipContentDef,
  CurveType,
} from '@spartan-ng/charts';

interface Series {
  dataKey: string;
  name: string;
  color: string;
  stackId?: string;
  fillOpacity?: number;
  icon?: string;
  gradient?: boolean;
}
interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
interface AreaVariant {
  curve: CurveType;
  indicator: 'line' | 'dot';
  hideLabel: boolean;
  series: Series[];
  stackOffset?: 'none' | 'expand';
  legend?: boolean;
  yAxis?: boolean;
  margin?: ChartMargin;
  interactive?: boolean;
}

// recharts reserves this much vertical space at the bottom for the legend row
// (measured: .recharts-legend-wrapper is 24px = pt-3 + the swatch/label row).
export const AREA_LEGEND_HEIGHT = 24;

const DESKTOP: Series = { dataKey: 'desktop', name: 'Desktop', color: 'var(--chart-1)' };
const MOBILE: Series = { dataKey: 'mobile', name: 'Mobile', color: 'var(--chart-2)' };
const OTHER: Series = { dataKey: 'other', name: 'Other', color: 'var(--chart-3)' };

export const AREA_VARIANTS: Record<string, AreaVariant> = {
  default: { curve: 'natural', indicator: 'line', hideLabel: false, series: [DESKTOP] },
  linear: { curve: 'linear', indicator: 'dot', hideLabel: true, series: [DESKTOP] },
  step: { curve: 'step', indicator: 'dot', hideLabel: true, series: [DESKTOP] },
  stacked: {
    curve: 'natural',
    indicator: 'dot',
    hideLabel: false,
    series: [
      { ...MOBILE, stackId: 'a' },
      { ...DESKTOP, stackId: 'a' },
    ],
  },
  expand: {
    curve: 'natural',
    indicator: 'line',
    hideLabel: false,
    stackOffset: 'expand',
    series: [
      { ...OTHER, stackId: 'a', fillOpacity: 0.1 },
      { ...MOBILE, stackId: 'a' },
      { ...DESKTOP, stackId: 'a' },
    ],
  },
  legend: {
    curve: 'natural',
    indicator: 'line',
    hideLabel: false,
    legend: true,
    series: [
      { ...MOBILE, stackId: 'a' },
      { ...DESKTOP, stackId: 'a' },
    ],
  },
  icons: {
    curve: 'natural',
    indicator: 'line',
    hideLabel: false,
    legend: true,
    series: [
      { ...MOBILE, stackId: 'a', icon: 'lucideTrendingUp' },
      { ...DESKTOP, stackId: 'a', icon: 'lucideTrendingDown' },
    ],
  },
  gradient: {
    curve: 'natural',
    indicator: 'dot',
    hideLabel: false,
    series: [
      { ...MOBILE, stackId: 'a', gradient: true },
      { ...DESKTOP, stackId: 'a', gradient: true },
    ],
  },
  axes: {
    curve: 'natural',
    indicator: 'dot',
    hideLabel: false,
    yAxis: true,
    margin: { top: 12, right: 12, bottom: 30, left: 40 },
    series: [
      { ...MOBILE, stackId: 'a' },
      { ...DESKTOP, stackId: 'a' },
    ],
  },
  interactive: {
    curve: 'natural',
    indicator: 'dot',
    hideLabel: false,
    interactive: true,
    legend: true,
    series: [
      { ...MOBILE, stackId: 'a', gradient: true, fillOpacity: 1 },
      { ...DESKTOP, stackId: 'a', gradient: true, fillOpacity: 1 },
    ],
  },
};

export const AREA_DATA = [
  { month: 'January', desktop: 186, mobile: 80, other: 45 },
  { month: 'February', desktop: 305, mobile: 200, other: 100 },
  { month: 'March', desktop: 237, mobile: 120, other: 150 },
  { month: 'April', desktop: 73, mobile: 190, other: 50 },
  { month: 'May', desktop: 209, mobile: 130, other: 100 },
  { month: 'June', desktop: 214, mobile: 140, other: 160 },
];

/**
 * Bare, chrome-less render of a shadcn area chart variant for pixel-diff capture.
 * ?chart= selects the variant, ?w= & ?h= the size (matched to the reference).
 */
@Component({
  selector: 'app-iso-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SpnAreaChart,
    SpnXAxis,
    SpnYAxis,
    SpnArea,
    SpnCartesianGrid,
    SpnTooltip,
    SpnTooltipContentDef,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideTrendingUp, lucideTrendingDown })],
  host: { class: 'iso-root' },
  template: `
    <div class="iso-chart" [style.width.px]="w()" [style.height.px]="h()" [attr.data-ready]="true">
      <spn-area-chart
        [data]="chartData()"
        [width]="w()"
        [height]="chartHeight()"
        [responsive]="false"
        [margin]="margin()"
        [stackOffset]="cfg().stackOffset ?? 'none'"
      >
        <spn-cartesian-grid [vertical]="false" strokeDasharray="0" stroke="hsl(var(--border) / 0.5)" [strokeWidth]="1" />
        <spn-x-axis
          [dataKey]="cfg().interactive ? 'date' : 'month'"
          [axisLine]="false"
          [tickLine]="false"
          [tickSize]="0"
          [tickPadding]="14"
          [tickFormatter]="cfg().interactive ? formatDate : formatMonth"
          [minTickGap]="cfg().interactive ? 32 : 0"
          stroke="hsl(var(--muted-foreground))"
        />
        @if (cfg().yAxis) {
          <spn-y-axis
            [axisLine]="false"
            [tickLine]="false"
            [tickSize]="0"
            [tickPadding]="8"
            [ticks]="3"
            stroke="hsl(var(--muted-foreground))"
          />
        }
        @for (s of cfg().series; track s.dataKey) {
          <spn-area
            [dataKey]="s.dataKey"
            [name]="s.name"
            [curve]="cfg().curve"
            [fill]="s.color"
            [fillOpacity]="s.fillOpacity ?? 0.4"
            [fillGradient]="!!s.gradient"
            [stroke]="s.color"
            [strokeWidth]="1"
            [stackId]="s.stackId"
            [isAnimationActive]="false"
            dot
            [dotSize]="0"
            [activeDot]="true"
            [activeDotSize]="4"
            [activeDotFill]="s.color"
            activeDotStroke="transparent"
            [activeDotStrokeWidth]="0"
          />
        }
        <spn-tooltip [cursor]="false">
          <ng-template spnTooltipContent let-state>
            <div class="spn-shadcn-tooltip">
              @if (showTopLabel()) {
                <div class="tlabel">{{ formatLabel(state.label) }}</div>
              }
              @for (item of state.payload; track item.dataKey) {
                <div class="row" [class.row-dot]="cfg().indicator === 'dot'">
                  <span class="indicator" [class.dot]="cfg().indicator === 'dot'" [style.background]="item.color"></span>
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
      </spn-area-chart>
      @if (cfg().legend) {
        <div class="spn-legend-row">
          @for (s of legendItems(); track s.dataKey) {
            <div class="legend-item">
              @if (s.icon) {
                <ng-icon class="legend-icon" [name]="s.icon" />
              } @else {
                <span class="swatch" [style.background]="s.color"></span>
              }
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
      spn-area-chart { display: block; }

      .spn-legend-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding-top: 0.75rem;
      }
      .spn-legend-row .legend-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .spn-legend-row .swatch {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 2px;
        flex-shrink: 0;
      }
      .spn-legend-row .legend-label {
        color: hsl(var(--foreground));
        font-size: 0.75rem;
        line-height: 1;
      }
      .spn-legend-row .legend-icon {
        display: inline-flex;
        font-size: 0.75rem;
        color: hsl(var(--muted-foreground));
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
      ::ng-deep .spn-shadcn-tooltip .indicator { width: 0.25rem; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
      ::ng-deep .spn-shadcn-tooltip .indicator.dot { width: 0.625rem; height: 0.625rem; align-self: center; }
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
export class IsoAreaComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected w = () => Number(this.params().get('w')) || 600;
  protected h = () => Number(this.params().get('h')) || 300;
  protected readonly cfg = computed(
    () => AREA_VARIANTS[this.params().get('chart') ?? 'default'] ?? AREA_VARIANTS['default'],
  );
  protected readonly chartHeight = computed(
    () => this.h() - (this.cfg().legend ? AREA_LEGEND_HEIGHT : 0),
  );
  // recharts orders the legend top-of-stack first (last declared series first).
  protected readonly legendItems = computed(() => [...this.cfg().series].reverse());

  // shadcn ChartTooltipContent: nestLabel when a single series with a line indicator
  protected readonly nestLabel = computed(
    () => this.cfg().series.length === 1 && this.cfg().indicator === 'line',
  );
  protected readonly showTopLabel = computed(
    () => !this.cfg().hideLabel && !this.nestLabel(),
  );

  protected readonly chartData = computed(
    () => (this.cfg().interactive ? INTERACTIVE_DATA : AREA_DATA) as unknown[],
  );
  protected readonly margin = computed(
    () => this.cfg().margin ?? { top: 12, right: 12, bottom: 30, left: 12 },
  );
  protected readonly formatMonth = (value: unknown): string => String(value).slice(0, 3);
  // "Apr 1" style date label (matches shadcn's toLocaleDateString usage).
  protected readonly formatDate = (value: unknown): string =>
    new Date(String(value)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  protected formatLabel(label: unknown): string {
    return this.cfg().interactive ? this.formatDate(label) : String(label ?? '');
  }
}
