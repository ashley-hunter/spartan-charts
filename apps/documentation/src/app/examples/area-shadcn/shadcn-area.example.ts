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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp, lucideTrendingDown } from '@ng-icons/lucide';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
  SpnTooltip,
  SpnTooltipContentDef,
} from '@spartan-ng/charts';
import { AREA_VARIANTS, AREA_DATA, AREA_LEGEND_HEIGHT } from '../../pages/iso-area.component';
import { INTERACTIVE_DATA } from '../../pages/interactive-data';
import { chartComponentTs } from '../../components/code-snippet.util';

/**
 * Faithful shadcn area chart, variant-driven, sized to its container
 * (mini ResponsiveContainer) so tick text stays 12px. Shares the variant
 * config + data with the iso capture route.
 */
@Component({
  selector: 'app-shadcn-area',
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
  styles: [
    `
      /* Chart + legend are absolutely positioned so the SVG's intrinsic width
         never inflates the host - otherwise it traps the ResizeObserver at the
         default width and the card overflows narrow (mobile) viewports. */
      :host { display: block; width: 100%; min-width: 0; }
      .chart-box { position: relative; width: 100%; overflow: hidden; }
      spn-area-chart { position: absolute; top: 0; left: 0; right: 0; display: block; }
      .spn-legend-row {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding-top: 0.75rem;
      }
      .spn-legend-row .legend-item { display: flex; align-items: center; gap: 0.375rem; }
      .spn-legend-row .swatch { width: 0.5rem; height: 0.5rem; border-radius: 2px; flex-shrink: 0; }
      .spn-legend-row .legend-label { color: hsl(var(--foreground)); font-size: 0.75rem; line-height: 1; }
      .spn-legend-row .legend-icon { display: inline-flex; font-size: 0.75rem; color: hsl(var(--muted-foreground)); }
    `,
  ],
  template: `
    <div class="chart-box" [style.height.px]="height()">
    <spn-area-chart
      [data]="chartData()"
      [width]="width()"
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
          [animationDuration]="1500"
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
})
export class ShadcnAreaExampleComponent {
  readonly variant = input<string>('default');
  protected readonly cfg = computed(
    () => AREA_VARIANTS[this.variant()] ?? AREA_VARIANTS['default'],
  );
  protected readonly nestLabel = computed(
    () => this.cfg().series.length === 1 && this.cfg().indicator === 'line',
  );
  protected readonly showTopLabel = computed(
    () => !this.cfg().hideLabel && !this.nestLabel(),
  );
  protected readonly chartHeight = computed(
    () => this.height() - (this.cfg().legend ? AREA_LEGEND_HEIGHT : 0),
  );
  protected readonly legendItems = computed(() => [...this.cfg().series].reverse());

  /** Representative Spartan usage for the current variant (View Code). */
  protected readonly code = computed(() => {
    const c = this.cfg();
    const areas = c.series
      .map(
        (s) =>
          `  <spn-area dataKey="${s.dataKey}" curve="${c.curve}" fill="${s.color}"` +
          ` [fillOpacity]="${s.fillOpacity ?? 0.4}" stroke="${s.color}"` +
          (s.stackId ? ` stackId="${s.stackId}"` : '') +
          (s.gradient ? ' fillGradient' : '') +
          ' />',
      )
      .join('\n');
    const stack =
      c.stackOffset && c.stackOffset !== 'none' ? ` stackOffset="${c.stackOffset}"` : '';
    const xKey = c.interactive ? 'date' : 'month';
    const yAxis = c.yAxis ? '  <spn-y-axis [ticks]="3" />\n' : '';
    return (
      `<spn-area-chart [data]="data"${stack}>\n` +
      `  <spn-cartesian-grid [vertical]="false" />\n` +
      `  <spn-x-axis dataKey="${xKey}" [tickFormatter]="fmt" />\n` +
      yAxis +
      areas +
      '\n  <spn-tooltip />\n' +
      '</spn-area-chart>'
    );
  });

  readonly tsCode = computed(() =>
    chartComponentTs(
      'app-area-demo',
      ['SpnAreaChart', 'SpnArea', 'SpnXAxis', 'SpnCartesianGrid', 'SpnTooltip'],
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

  // Time-range filter for the interactive variant (days back from 2024-06-30).
  readonly rangeDays = input(90);
  protected readonly chartData = computed(() => {
    if (!this.cfg().interactive) return AREA_DATA as unknown[];
    const end = new Date('2024-06-30');
    const start = new Date(end);
    start.setDate(start.getDate() - (this.rangeDays() - 1));
    return INTERACTIVE_DATA.filter((d) => new Date(d.date) >= start) as unknown[];
  });
  protected readonly margin = computed(
    () => this.cfg().margin ?? { top: 12, right: 12, bottom: 30, left: 12 },
  );
  protected readonly formatMonth = (value: unknown): string => String(value).slice(0, 3);
  protected readonly formatDate = (value: unknown): string =>
    new Date(String(value)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  protected formatLabel(label: unknown): string {
    return this.cfg().interactive ? this.formatDate(label) : String(label ?? '');
  }
}
