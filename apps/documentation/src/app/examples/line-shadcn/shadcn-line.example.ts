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
  SpnCartesianGrid,
  SpnLine,
  SpnLineChart,
  SpnTooltip,
  SpnTooltipContentDef,
  SpnXAxis,
  SpnYAxis,
} from '@spartan-ng/charts';
import {
  LINE_BROWSER_DATA,
  LINE_BROWSER_LABELS,
  LINE_DATA,
  LINE_VARIANTS,
} from '../../pages/iso-line.component';
import { INTERACTIVE_DATA } from '../../pages/interactive-data';
import { chartComponentTs } from '../../components/code-snippet.util';

/** Faithful shadcn line chart, variant-driven, sized to its container. */
@Component({
  selector: 'app-shadcn-line',
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
  styles: [
    `
      :host { display: block; width: 100%; min-width: 0; }
      .chart-box { position: relative; width: 100%; overflow: hidden; }
      spn-line-chart { position: absolute; top: 0; left: 0; right: 0; display: block; }
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
    `,
  ],
  template: `
    <div class="chart-box" [style.height.px]="height()">
    <spn-line-chart [data]="chartData()" [width]="width()" [height]="height()" [responsive]="false" [margin]="margin()">
      <spn-cartesian-grid [vertical]="false" strokeDasharray="0" stroke="hsl(var(--border) / 0.5)" [strokeWidth]="1" />
      <spn-x-axis
        [dataKey]="categoryKey()"
        [axisLine]="false"
        [tickLine]="false"
        [tickSize]="0"
        [tickPadding]="14"
        [minTickGap]="cfg().dateAxis ? 32 : 0"
        [tickFormatter]="cfg().hideCategoryAxis ? emptyTick : formatCategory"
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
          [animationDuration]="800"
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
      <svg class="line-label-overlay" [attr.width]="width()" [attr.height]="height()">
        @for (point of labelPoints(); track point.key) {
          <text [attr.x]="point.x" [attr.y]="point.y" text-anchor="middle">{{ point.label }}</text>
        }
      </svg>
    }
    </div>
  `,
})
export class ShadcnLineExampleComponent {
  readonly variant = input<string>('default');
  protected readonly cfg = computed(
    () => LINE_VARIANTS[this.variant()] ?? LINE_VARIANTS['default'],
  );

  /** Representative Spartan usage for the current variant (View Code). */
  protected readonly code = computed(() => {
    const c = this.cfg();
    const lines = c.series
      .map(
        (s) =>
          `  <spn-line dataKey="${s.dataKey}" curve="${c.curve}" stroke="${s.color}"` +
          ' [strokeWidth]="2"' +
          (s.dot ? ' dot' : '') +
          ' />',
      )
      .join('\n');
    return (
      '<spn-line-chart [data]="data">\n' +
      '  <spn-cartesian-grid [vertical]="false" />\n' +
      '  <spn-x-axis dataKey="month" [tickFormatter]="fmt" />\n' +
      lines +
      '\n  <spn-tooltip />\n' +
      '</spn-line-chart>'
    );
  });

  readonly tsCode = computed(() =>
    chartComponentTs(
      'app-line-demo',
      ['SpnLineChart', 'SpnLine', 'SpnXAxis', 'SpnCartesianGrid', 'SpnTooltip'],
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
  protected readonly labelPoints = computed(() => {
    const margin = this.margin();
    const innerWidth = this.width() - margin.left - margin.right;
    const innerHeight = this.height() - margin.top - margin.bottom;
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
}
