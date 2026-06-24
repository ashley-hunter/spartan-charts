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
  SpnRadar,
  SpnRadarChart,
  SpnTooltip,
  SpnTooltipContentDef,
  RadarAxisLabelLine,
} from '@spartan-ng/charts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { chartComponentTs } from '../../components/code-snippet.util';
import {
  RADAR_LABELS,
  RADAR_LEGEND_HEIGHT,
  RADAR_VARIANTS,
  RadarDatum,
} from '../../pages/iso-radar.component';

/** Faithful shadcn radar chart, variant-driven, sized to its container. */
@Component({
  selector: 'app-shadcn-radar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SpnRadarChart,
    SpnRadar,
    SpnPolarGrid,
    SpnTooltip,
    SpnTooltipContentDef,
  ],
  styles: [
    `
      :host { display: block; width: 100%; min-width: 0; }
      .chart-box { position: relative; width: 100%; }
      spn-radar-chart { display: block; margin-inline: auto; }
      ::ng-deep .spn-radar-chart { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
      .spn-legend-row { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; }
      .spn-legend-row .legend-item { display: flex; align-items: center; gap: 0.375rem; }
      .spn-legend-row .swatch { width: 0.5rem; height: 0.5rem; border-radius: 2px; flex-shrink: 0; }
      .spn-legend-row .legend-icon { display: inline-flex; color: hsl(var(--muted-foreground)); }
      .spn-legend-row .legend-label { color: hsl(var(--foreground)); font-size: 0.75rem; line-height: 1; }
    `,
  ],
  template: `
    <div class="chart-box" [style.height.px]="size()">
      <spn-radar-chart
        [data]="cfg().data"
        dataKey="month"
        [width]="size()"
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
})
export class ShadcnRadarExampleComponent {
  readonly variant = input<string>('default');
  protected readonly cfg = computed(
    () => RADAR_VARIANTS[this.variant()] ?? RADAR_VARIANTS['default'],
  );

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
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

  protected readonly chartHeight = computed(() =>
    this.size() - (this.cfg().legend ? RADAR_LEGEND_HEIGHT : 0),
  );

  protected readonly margin = computed(() => {
    const c = this.cfg();
    if (c.legend) return { top: -25, right: 0, bottom: -25, left: 0 };
    if (c.labelCustom) return { top: 10, right: 10, bottom: 10, left: 10 };
    return { top: 5, right: 5, bottom: 5, left: 5 };
  });

  private readonly icons: Record<string, string> = {
    desktop:
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 3H5"/><path d="M12 21V7"/><path d="m6 15 6 6 6-6"/></svg>',
    mobile:
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg>',
  };

  protected iconFor(dataKey: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.icons[dataKey] ?? '');
  }

  protected readonly formatName = (value: unknown): string =>
    RADAR_LABELS[String(value)] ?? String(value);

  protected readonly customAxisLabel = (datum: RadarDatum): RadarAxisLabelLine[] => [
    { text: String(datum.desktop ?? '') },
    { text: '/', muted: true },
    { text: String(datum.mobile ?? '') },
    { text: datum.month, muted: true, break: true },
  ];

  protected readonly code = computed(() => {
    const c = this.cfg();
    const grid = c.gridType === 'circle' ? ' gridType="circle"' : '';
    const series = c.series
      .map((s) => `  <spn-radar dataKey="${s.dataKey}" fill="${s.fill}" />`)
      .join('\n');
    return (
      '<spn-radar-chart [data]="data" dataKey="month">\n' +
      `  <spn-polar-grid${grid} />\n` +
      series +
      '\n  <spn-tooltip />\n' +
      '</spn-radar-chart>'
    );
  });

  readonly tsCode = computed(() =>
    chartComponentTs(
      'app-radar-demo',
      ['SpnRadarChart', 'SpnRadar', 'SpnPolarGrid', 'SpnTooltip'],
      this.code(),
      this.cfg().data,
    ),
  );
}
