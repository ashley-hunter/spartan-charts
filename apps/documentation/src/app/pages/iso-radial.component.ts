import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SpnPolarGrid,
  SpnRadialBar,
  SpnRadialBarChart,
  SpnTooltip,
  SpnTooltipContentDef,
} from '@spartan-ng/charts';

export interface RadialDatum {
  [key: string]: string | number;
}

interface RadialVariant {
  data: RadialDatum[];
  innerRadius: number;
  outerRadius: number;
  startAngle?: number;
  endAngle?: number;
  background?: boolean;
  cornerRadius?: number;
  label?: boolean;
  stacked?: boolean;
  centerText?: boolean | 'stacked';
  trackGrid?: [number, number]; // [outerTrackR, innerTrackR] muted/background circles
  polarGrid?: boolean; // concentric-circle polar grid behind the bars
}

export const RADIAL_DATA: RadialDatum[] = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
];

const STACKED_DATA: RadialDatum[] = [{ month: 'january', mobile: 570, desktop: 1260 }];
const TEXT_DATA: RadialDatum[] = [{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' }];
const SHAPE_DATA: RadialDatum[] = [{ browser: 'safari', visitors: 1260, fill: 'var(--chart-2)' }];

export const RADIAL_LABELS: Record<string, string> = {
  chrome: 'Chrome',
  safari: 'Safari',
  firefox: 'Firefox',
  edge: 'Edge',
  other: 'Other',
};

export const RADIAL_VARIANTS: Record<string, RadialVariant> = {
  simple: { data: RADIAL_DATA, innerRadius: 30, outerRadius: 110, background: true },
  label: {
    data: RADIAL_DATA,
    innerRadius: 30,
    outerRadius: 110,
    startAngle: -90,
    endAngle: 380,
    background: true,
    label: true,
  },
  grid: { data: RADIAL_DATA, innerRadius: 30, outerRadius: 100, polarGrid: true },
  text: {
    data: TEXT_DATA,
    innerRadius: 80,
    outerRadius: 90,
    startAngle: 0,
    endAngle: 250,
    background: true,
    cornerRadius: 10,
    centerText: true,
    trackGrid: [90, 80],
  },
  stacked: {
    data: STACKED_DATA,
    innerRadius: 80,
    outerRadius: 110,
    startAngle: 0,
    endAngle: 180,
    cornerRadius: 5,
    stacked: true,
    centerText: 'stacked',
  },
  shape: {
    data: SHAPE_DATA,
    innerRadius: 65,
    outerRadius: 95,
    startAngle: 0,
    endAngle: 100,
    background: true,
    centerText: true,
    trackGrid: [86, 74],
  },
};

/** Bare, chrome-less render of a shadcn radial chart variant for pixel-diff capture. */
@Component({
  selector: 'app-iso-radial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpnRadialBarChart, SpnRadialBar, SpnPolarGrid, SpnTooltip, SpnTooltipContentDef],
  host: { class: 'iso-root' },
  template: `
    <div class="iso-chart" [style.width.px]="w()" [style.height.px]="h()" [attr.data-ready]="true">
      @if (cfg().trackGrid) {
        <svg class="track-grid" [attr.width]="w()" [attr.height]="h()">
          <circle [attr.cx]="w() / 2" [attr.cy]="h() / 2" [attr.r]="cfg().trackGrid![0]" fill="hsl(var(--muted))" />
          <circle [attr.cx]="w() / 2" [attr.cy]="h() / 2" [attr.r]="cfg().trackGrid![1]" fill="hsl(var(--background))" />
        </svg>
      }
      <spn-radial-bar-chart
        [data]="cfg().data"
        [width]="w()"
        [height]="h()"
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
          <spn-radial-bar dataKey="mobile" fill="var(--chart-2)" stackId="a" [cornerRadius]="cfg().cornerRadius ?? 0" stroke="transparent" [strokeWidth]="2" [isAnimationActive]="false" />
          <spn-radial-bar dataKey="desktop" fill="var(--chart-1)" stackId="a" [cornerRadius]="cfg().cornerRadius ?? 0" stroke="transparent" [strokeWidth]="2" [isAnimationActive]="false" />
        } @else {
          <spn-radial-bar
            dataKey="visitors"
            nameKey="browser"
            [background]="cfg().background ?? false"
            [cornerRadius]="cfg().cornerRadius ?? 0"
            [label]="cfg().label ?? false"
            labelKey="browser"
            [isAnimationActive]="false"
          />
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
        <svg class="center-label" [attr.width]="w()" [attr.height]="h()">
          @if (cfg().centerText === 'stacked') {
            <text [attr.x]="w() / 2" [attr.y]="h() / 2" text-anchor="middle">
              <tspan class="center-value stacked" [attr.x]="w() / 2" [attr.y]="h() / 2 - 16">{{ centerValue() }}</tspan>
              <tspan class="center-caption" [attr.x]="w() / 2" [attr.y]="h() / 2 + 4">Visitors</tspan>
            </text>
          } @else {
            <text [attr.x]="w() / 2" [attr.y]="h() / 2" text-anchor="middle" dominant-baseline="middle">
              <tspan class="center-value" [attr.x]="w() / 2" [attr.y]="h() / 2">{{ centerValue() }}</tspan>
              <tspan class="center-caption" [attr.x]="w() / 2" [attr.y]="h() / 2 + 24">Visitors</tspan>
            </text>
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
      spn-radial-bar-chart { display: block; }
      .track-grid, .center-label {
        position: absolute;
        inset: 0;
        pointer-events: none;
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .center-value { fill: hsl(var(--foreground)); font-size: 36px; font-weight: 700; }
      .center-value.stacked { font-size: 24px; }
      .center-caption { fill: hsl(var(--muted-foreground)); font-size: 16px; }

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
      ::ng-deep .spn-shadcn-tooltip .indicator.dot { width: 0.625rem; height: 0.625rem; border-radius: 2px; flex-shrink: 0; }
      ::ng-deep .spn-shadcn-tooltip .body { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 0.5rem; line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .name { color: hsl(var(--muted-foreground)); line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .value {
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1; color: hsl(var(--foreground));
      }
    `,
  ],
})
export class IsoRadialComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected w = () => Number(this.params().get('w')) || 250;
  protected h = () => Number(this.params().get('h')) || 250;
  protected readonly cfg = computed(
    () => RADIAL_VARIANTS[this.params().get('chart') ?? 'simple'] ?? RADIAL_VARIANTS['simple'],
  );

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
}
