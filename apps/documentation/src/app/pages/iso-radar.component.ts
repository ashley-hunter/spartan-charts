import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SpnPolarGrid,
  SpnRadar,
  SpnRadarChart,
  SpnTooltip,
  SpnTooltipContentDef,
  RadarAxisLabelLine,
} from '@spartan-ng/charts';

export interface RadarDatum {
  month: string;
  desktop?: number;
  mobile?: number;
}

interface RadarSeries {
  dataKey: string;
  name: string;
  fill: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  dot?: boolean;
}

interface RadarVariant {
  data: RadarDatum[];
  series: RadarSeries[];
  gridType?: 'polygon' | 'circle';
  radialLines?: boolean;
  legend?: boolean;
  legendIcons?: boolean;
  labelCustom?: boolean;
  /** Hide the polar grid entirely. */
  hideGrid?: boolean;
  /** Fill the concentric grid rings. */
  gridFill?: string;
  gridFillOpacity?: number;
  /** Explicit grid ring radii (recharts polarRadius). */
  polarRadius?: number[];
  /** Show a polar radius axis at the given angle. */
  radiusAxis?: boolean;
}

const DEFAULT_DATA: RadarDatum[] = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 273 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const LINES_ONLY_DATA: RadarDatum[] = [
  { month: 'January', desktop: 186, mobile: 160 },
  { month: 'February', desktop: 185, mobile: 170 },
  { month: 'March', desktop: 207, mobile: 180 },
  { month: 'April', desktop: 173, mobile: 160 },
  { month: 'May', desktop: 160, mobile: 190 },
  { month: 'June', desktop: 174, mobile: 204 },
];

const MULTIPLE_DATA: RadarDatum[] = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const GRID_FILL_DATA: RadarDatum[] = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 285 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 203 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 264 },
];

const GRID_CIRCLE_NO_LINES_DATA: RadarDatum[] = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 203 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

export const RADAR_LABELS: Record<string, string> = { desktop: 'Desktop', mobile: 'Mobile' };

const DESKTOP: RadarSeries = { dataKey: 'desktop', name: 'Desktop', fill: 'var(--chart-1)', fillOpacity: 0.6 };
const MOBILE: RadarSeries = { dataKey: 'mobile', name: 'Mobile', fill: 'var(--chart-2)', fillOpacity: 1 };

export const RADAR_VARIANTS: Record<string, RadarVariant> = {
  default: { data: DEFAULT_DATA, series: [DESKTOP] },
  'lines-only': {
    data: LINES_ONLY_DATA,
    radialLines: false,
    series: [
      { dataKey: 'desktop', name: 'Desktop', fill: 'var(--chart-1)', fillOpacity: 0, stroke: 'var(--chart-1)', strokeWidth: 2 },
      { dataKey: 'mobile', name: 'Mobile', fill: 'var(--chart-2)', fillOpacity: 0, stroke: 'var(--chart-2)', strokeWidth: 2 },
    ],
  },
  dots: { data: DEFAULT_DATA, series: [{ ...DESKTOP, dot: true }] },
  multiple: { data: MULTIPLE_DATA, series: [DESKTOP, MOBILE] },
  legend: { data: MULTIPLE_DATA, series: [DESKTOP, MOBILE], legend: true },
  'grid-circle': { data: DEFAULT_DATA, gridType: 'circle', series: [{ ...DESKTOP, dot: true }] },
  'label-custom': { data: MULTIPLE_DATA, series: [DESKTOP, MOBILE], labelCustom: true },
  'grid-none': { data: DEFAULT_DATA, hideGrid: true, series: [{ ...DESKTOP, dot: true }] },
  'grid-fill': {
    data: GRID_FILL_DATA,
    gridFill: 'var(--chart-1)',
    gridFillOpacity: 0.2,
    series: [{ ...DESKTOP, fillOpacity: 0.5 }],
  },
  'grid-custom': {
    data: DEFAULT_DATA,
    radialLines: false,
    polarRadius: [90],
    series: [DESKTOP],
  },
  'grid-circle-no-lines': {
    data: GRID_CIRCLE_NO_LINES_DATA,
    gridType: 'circle',
    radialLines: false,
    series: [{ ...DESKTOP, dot: true }],
  },
  icons: { data: MULTIPLE_DATA, series: [DESKTOP, MOBILE], legend: true, legendIcons: true },
  radius: { data: MULTIPLE_DATA, series: [DESKTOP, MOBILE], radiusAxis: true },
};

export const RADAR_LEGEND_HEIGHT = 52;

/** Bare, chrome-less render of a shadcn radar chart variant for pixel-diff capture. */
@Component({
  selector: 'app-iso-radar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpnRadarChart, SpnRadar, SpnPolarGrid, SpnTooltip, SpnTooltipContentDef],
  host: { class: 'iso-root' },
  template: `
    <div class="iso-chart" [style.width.px]="w()" [style.height.px]="h()" [attr.data-ready]="true">
      <spn-radar-chart
        [data]="cfg().data"
        dataKey="month"
        [width]="w()"
        [height]="chartHeight()"
        [responsive]="false"
        [margin]="margin()"
        [axisLabel]="cfg().labelCustom ? customAxisLabel : undefined"
        [showRadiusAxis]="cfg().radiusAxis ?? false"
        [radiusAxisAngle]="60"
      >
        @if (!cfg().hideGrid) {
          <spn-polar-grid
            [gridType]="cfg().gridType ?? 'polygon'"
            [radialLines]="cfg().radialLines ?? true"
            [fill]="cfg().gridFill"
            [fillOpacity]="cfg().gridFillOpacity ?? 1"
            [polarRadius]="cfg().polarRadius"
          />
        }
        @for (s of cfg().series; track s.dataKey) {
          <spn-radar
            [dataKey]="s.dataKey"
            [name]="s.name"
            [fill]="s.fill"
            [fillOpacity]="s.fillOpacity ?? 0.6"
            [stroke]="s.stroke ?? s.fill"
            [strokeWidth]="s.strokeWidth ?? 1"
            [dot]="s.dot ?? false"
          />
        }
        <spn-tooltip [cursor]="false">
          <ng-template spnTooltipContent let-state>
            <div class="spn-shadcn-tooltip">
              <div class="tt-label">{{ state.label }}</div>
              @for (item of state.payload; track item.name) {
                <div class="row">
                  <span class="indicator line" [style.background]="item.color"></span>
                  <div class="body">
                    <div class="labels"><span class="name">{{ formatName(item.name) }}</span></div>
                    <span class="value">{{ item.value }}</span>
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </spn-tooltip>
      </spn-radar-chart>
      @if (cfg().legend) {
        <div class="spn-legend-row">
          @for (s of cfg().series; track s.dataKey) {
            <div class="legend-item">
              @if (cfg().legendIcons) {
                <span class="legend-icon" [innerHTML]="iconFor(s.dataKey)"></span>
              } @else {
                <span class="swatch" [style.background]="s.fill"></span>
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
        position: relative;
        background: hsl(var(--card));
        font-size: 12px;
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      spn-radar-chart { display: block; }
      .spn-legend-row {
        display: flex; align-items: center; justify-content: center; gap: 1rem;
        margin-top: 2rem; padding-top: 0.75rem;
      }
      .spn-legend-row .legend-item { display: flex; align-items: center; gap: 0.375rem; }
      .spn-legend-row .swatch { width: 0.5rem; height: 0.5rem; border-radius: 2px; flex-shrink: 0; }
      .spn-legend-row .legend-icon { display: inline-flex; color: hsl(var(--muted-foreground)); }
      .spn-legend-row .legend-label { color: hsl(var(--foreground)); font-size: 0.75rem; line-height: 1; }

      ::ng-deep .spn-shadcn-tooltip {
        min-width: 8rem; display: grid; align-items: start; gap: 0.375rem;
        border-radius: 0.5rem; border: 1px solid hsl(var(--border) / 0.5);
        background: hsl(var(--background)); padding: 0.375rem 0.625rem;
        font-size: 0.75rem; line-height: 1rem;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        color: hsl(var(--foreground));
      }
      ::ng-deep .spn-shadcn-tooltip .tt-label { font-weight: 500; color: hsl(var(--foreground)); }
      ::ng-deep .spn-shadcn-tooltip .row { display: flex; width: 100%; align-items: center; gap: 0.5rem; }
      ::ng-deep .spn-shadcn-tooltip .indicator.line { width: 0.25rem; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
      ::ng-deep .spn-shadcn-tooltip .body { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 0.5rem; line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .name { color: hsl(var(--muted-foreground)); line-height: 1; }
      ::ng-deep .spn-shadcn-tooltip .value {
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1; color: hsl(var(--foreground));
      }
    `,
  ],
})
export class IsoRadarComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected w = () => Number(this.params().get('w')) || 250;
  protected h = () => Number(this.params().get('h')) || 250;
  protected readonly cfg = computed(
    () => RADAR_VARIANTS[this.params().get('chart') ?? 'default'] ?? RADAR_VARIANTS['default'],
  );

  protected readonly chartHeight = computed(() =>
    this.h() - (this.cfg().legend ? RADAR_LEGEND_HEIGHT : 0),
  );

  protected readonly margin = computed(() => {
    const c = this.cfg();
    // recharts RadarChart lets axis labels overflow the polygon; the chart
    // itself uses a small (or negative) margin and the surface clips at the box.
    // Symmetric negative margins enlarge the polygon to fill the square area
    // (matching recharts' legend variant geometry: centred, radius ~= half-height).
    if (c.legend) return { top: -25, right: 0, bottom: -25, left: 0 };
    if (c.labelCustom) return { top: 10, right: 10, bottom: 10, left: 10 };
    return { top: 5, right: 5, bottom: 5, left: 5 };
  });

  protected readonly formatName = (value: unknown): string =>
    RADAR_LABELS[String(value)] ?? String(value);

  /** shadcn radar-label-custom: "desktop / mobile" then the month underneath. */
  protected readonly customAxisLabel = (
    datum: RadarDatum,
  ): RadarAxisLabelLine[] => [
    { text: String(datum.desktop ?? '') },
    { text: '/', muted: true },
    { text: String(datum.mobile ?? '') },
    { text: datum.month, muted: true, break: true },
  ];

  /** lucide arrow icons for the radar "icons" legend variant. */
  private readonly icons: Record<string, string> = {
    // arrow-down-from-line
    desktop:
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 3H5"/><path d="M12 21V7"/><path d="m6 15 6 6 6-6"/></svg>',
    // arrow-up-from-line
    mobile:
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg>',
  };

  protected iconFor(dataKey: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.icons[dataKey] ?? '');
  }
}
