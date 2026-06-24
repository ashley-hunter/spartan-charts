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
  SpnPolarGrid,
  SpnRadialBar,
  SpnRadialBarChart,
  SpnTooltip,
  SpnTooltipContentDef,
} from '@spartan-ng/charts';
import { chartComponentTs } from '../../components/code-snippet.util';
import { RADIAL_LABELS, RADIAL_VARIANTS } from '../../pages/iso-radial.component';

/** Faithful shadcn radial bar chart, variant-driven, sized to its container. */
@Component({
  selector: 'app-shadcn-radial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SpnRadialBarChart,
    SpnRadialBar,
    SpnPolarGrid,
    SpnTooltip,
    SpnTooltipContentDef,
  ],
  styles: [
    `
      :host { display: block; width: 100%; min-width: 0; }
      .chart-box { position: relative; width: 100%; overflow: hidden; }
      spn-radial-bar-chart { position: absolute; top: 0; left: 0; right: 0; display: block; }
      ::ng-deep .spn-radial-bar-chart { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
      ::ng-deep svg.spn-radial-bar-chart { display: block; margin-inline: auto; }
      .track-grid, .center-label { position: absolute; top: 0; left: 50%; transform: translateX(-50%); pointer-events: none; }
      .center-value { fill: hsl(var(--foreground)); font-size: 36px; font-weight: 700; }
      .center-value.stacked { font-size: 24px; }
      .center-caption { fill: hsl(var(--muted-foreground)); font-size: 16px; }
    `,
  ],
  template: `
    <div class="chart-box" [style.height.px]="size()">
      @if (cfg().trackGrid) {
        <svg class="track-grid" [attr.width]="size()" [attr.height]="size()">
          <circle [attr.cx]="size() / 2" [attr.cy]="size() / 2" [attr.r]="cfg().trackGrid![0]" fill="hsl(var(--muted))" />
          <circle [attr.cx]="size() / 2" [attr.cy]="size() / 2" [attr.r]="cfg().trackGrid![1]" fill="hsl(var(--background))" />
        </svg>
      }
      <spn-radial-bar-chart
        [data]="cfg().data"
        [width]="size()"
        [height]="size()"
        [responsive]="false"
        [innerRadius]="cfg().innerRadius"
        [outerRadius]="cfg().outerRadius"
        [startAngle]="cfg().startAngle ?? 0"
        [endAngle]="cfg().endAngle ?? 360"
        [margin]="{ top: 5, right: 5, bottom: 5, left: 5 }"
      >
        @if (cfg().polarGrid) {
          <spn-polar-grid gridType="circle" />
        }
        @if (cfg().stacked) {
          <spn-radial-bar dataKey="mobile" fill="var(--chart-2)" stackId="a" [cornerRadius]="cfg().cornerRadius ?? 0" stroke="transparent" [strokeWidth]="2" [isAnimationActive]="true" />
          <spn-radial-bar dataKey="desktop" fill="var(--chart-1)" stackId="a" [cornerRadius]="cfg().cornerRadius ?? 0" stroke="transparent" [strokeWidth]="2" [isAnimationActive]="true" />
        } @else {
          <spn-radial-bar dataKey="visitors" nameKey="browser" [background]="cfg().background ?? false" [cornerRadius]="cfg().cornerRadius ?? 0" [label]="cfg().label ?? false" labelKey="browser" [isAnimationActive]="true" />
        }
        <spn-tooltip [cursor]="false">
          <ng-template spnTooltipContent let-state>
            <div class="spn-shadcn-tooltip">
              @for (item of state.payload; track item.name) {
                <div class="row row-dot">
                  <span class="indicator dot" [style.background]="item.color"></span>
                  <div class="body">
                    <div class="labels"><span class="name">{{ formatName(item.name) }}</span></div>
                    <span class="value">{{ item.value }}</span>
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </spn-tooltip>
      </spn-radial-bar-chart>
      @if (cfg().centerText) {
        <svg class="center-label" [attr.width]="size()" [attr.height]="size()">
          @if (cfg().centerText === 'stacked') {
            <text [attr.x]="size() / 2" [attr.y]="size() / 2" text-anchor="middle">
              <tspan class="center-value stacked" [attr.x]="size() / 2" [attr.y]="size() / 2 - 16">{{ centerValue() }}</tspan>
              <tspan class="center-caption" [attr.x]="size() / 2" [attr.y]="size() / 2 + 4">Visitors</tspan>
            </text>
          } @else {
            <text [attr.x]="size() / 2" [attr.y]="size() / 2" text-anchor="middle" dominant-baseline="middle">
              <tspan class="center-value" [attr.x]="size() / 2" [attr.y]="size() / 2">{{ centerValue() }}</tspan>
              <tspan class="center-caption" [attr.x]="size() / 2" [attr.y]="size() / 2 + 24">Visitors</tspan>
            </text>
          }
        </svg>
      }
    </div>
  `,
})
export class ShadcnRadialExampleComponent {
  readonly variant = input<string>('simple');
  protected readonly cfg = computed(
    () => RADIAL_VARIANTS[this.variant()] ?? RADIAL_VARIANTS['simple'],
  );

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly size = signal(250);

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      const apply = () => {
        const w = el.clientWidth;
        if (w > 0) this.size.set(Math.min(w, 250));
      };
      apply();
      const ro = new ResizeObserver(apply);
      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  protected readonly centerValue = computed(() => {
    const c = this.cfg();
    if (c.centerText === 'stacked') {
      const d = c.data[0];
      return (Number(d['desktop'] ?? 0) + Number(d['mobile'] ?? 0)).toLocaleString();
    }
    return Number(c.data[0]['visitors'] ?? 0).toLocaleString();
  });

  protected readonly formatName = (value: unknown): string =>
    RADIAL_LABELS[String(value)] ?? String(value);

  protected readonly code = computed(() => {
    const c = this.cfg();
    const grid = c.polarGrid ? '  <spn-polar-grid gridType="circle" />\n' : '';
    return (
      '<spn-radial-bar-chart [data]="data" [innerRadius]="' +
      c.innerRadius +
      '" [outerRadius]="' +
      c.outerRadius +
      '">\n' +
      grid +
      `  <spn-radial-bar dataKey="visitors"${c.background ? ' background' : ''} />\n` +
      '  <spn-tooltip />\n' +
      '</spn-radial-bar-chart>'
    );
  });

  readonly tsCode = computed(() =>
    chartComponentTs(
      'app-radial-demo',
      ['SpnRadialBarChart', 'SpnRadialBar', 'SpnPolarGrid', 'SpnTooltip'],
      this.code(),
      this.cfg().data,
    ),
  );
}
