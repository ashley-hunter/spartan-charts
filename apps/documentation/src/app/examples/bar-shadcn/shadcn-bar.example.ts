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
import {
  SpnBarChart,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
  SpnCartesianGrid,
  SpnTooltip,
  SpnTooltipContentDef,
} from '@spartan-ng/charts';
import {
  BAR_VARIANTS,
  BAR_DATA,
  BAR_LEGEND_HEIGHT,
  BROWSER_DATA,
  NEGATIVE_DATA,
  BROWSER_LABELS,
} from '../../pages/iso-bar.component';
import { INTERACTIVE_DATA } from '../../pages/interactive-data';
import { chartComponentTs } from '../../components/code-snippet.util';

/**
 * Faithful shadcn bar chart, variant-driven, sized to its container. Shares the
 * variant config + data with the iso capture route.
 */
@Component({
  selector: 'app-shadcn-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef],
  styles: [
    `
      :host { display: block; width: 100%; min-width: 0; }
      .chart-box { position: relative; width: 100%; overflow: hidden; }
      spn-bar-chart { position: absolute; top: 0; left: 0; right: 0; display: block; }
      .spn-legend-row { position: absolute; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; gap: 1rem; padding-top: 0.75rem; }
      .spn-legend-row .legend-item { display: flex; align-items: center; gap: 0.375rem; }
      .spn-legend-row .swatch { width: 0.5rem; height: 0.5rem; border-radius: 2px; flex-shrink: 0; }
      .spn-legend-row .legend-label { color: hsl(var(--foreground)); font-size: 0.75rem; line-height: 1; }
    `,
  ],
  template: `
    <div class="chart-box" [style.height.px]="height()">
    <spn-bar-chart [data]="chartData()" [width]="width()" [height]="chartHeight()" [responsive]="false" [margin]="margin()" [layout]="cfg().layout ?? 'vertical'">
      @if (cfg().layout === 'horizontal') {
        <spn-y-axis
          [dataKey]="categoryKey()"
          [axisLine]="false"
          [tickLine]="false"
          [tickSize]="0"
          [tickPadding]="10"
          [tickFormatter]="formatCategory"
          stroke="hsl(var(--muted-foreground))"
        />
      } @else {
        <spn-cartesian-grid [vertical]="false" strokeDasharray="0" stroke="hsl(var(--border) / 0.5)" [strokeWidth]="1" />
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
        <spn-bar [dataKey]="s.dataKey" [name]="s.name" [fill]="s.color" [radius]="s.radius" [label]="s.label ?? false" [stackId]="s.stackId" [activeIndex]="s.activeIndex ?? -1" [activeStrokeDasharray]="s.activeStrokeDasharray" [animationDuration]="800" />
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
})
export class ShadcnBarExampleComponent {
  readonly variant = input<string>('default');
  protected readonly cfg = computed(
    () => BAR_VARIANTS[this.variant()] ?? BAR_VARIANTS['default'],
  );

  /** Representative Spartan usage for the current variant (View Code). */
  protected readonly code = computed(() => {
    const c = this.cfg();
    const bars = c.series
      .map(
        (s) =>
          `  <spn-bar dataKey="${s.dataKey}" fill="${s.color}"` +
          ` [radius]="${JSON.stringify(s.radius)}"` +
          (s.stackId ? ` stackId="${s.stackId}"` : '') +
          ' />',
      )
      .join('\n');
    const layout = c.layout === 'horizontal' ? ' layout="horizontal"' : '';
    return (
      `<spn-bar-chart [data]="data"${layout}>\n` +
      `  <spn-cartesian-grid [vertical]="false" />\n` +
      `  <spn-x-axis dataKey="month" [tickFormatter]="fmt" />\n` +
      bars +
      '\n  <spn-tooltip />\n' +
      '</spn-bar-chart>'
    );
  });

  readonly tsCode = computed(() =>
    chartComponentTs(
      'app-bar-demo',
      ['SpnBarChart', 'SpnBar', 'SpnXAxis', 'SpnCartesianGrid', 'SpnTooltip'],
      this.code(),
      this.chartData(),
    ),
  );

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly width = signal(372);
  protected readonly height = signal(209);

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      const apply = () => {
        const w = el.clientWidth;
        if (w > 0) {
          this.width.set(w);
          this.height.set(Math.round((w * 9) / 16));
        }
      };
      apply();
      const ro = new ResizeObserver(apply);
      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  protected readonly indicator = computed(() => this.cfg().indicator ?? 'dot');
  protected readonly nestLabel = computed(
    () => this.cfg().series.length === 1 && this.indicator() === 'line',
  );
  protected readonly showTopLabel = computed(
    () => !this.cfg().hideLabel && !this.nestLabel(),
  );
  protected readonly chartHeight = computed(
    () => this.height() - (this.cfg().legend ? BAR_LEGEND_HEIGHT : 0),
  );
  protected readonly margin = computed(
    () => this.cfg().margin ?? { top: 12, right: 12, bottom: 30, left: 12 },
  );
  protected readonly categoryKey = computed(() => this.cfg().categoryKey ?? 'month');
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
