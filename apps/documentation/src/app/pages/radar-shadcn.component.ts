import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CodeDrawerService } from '../components/code-drawer.service';
import { ShadcnRadarExampleComponent } from '../examples/radar-shadcn/shadcn-radar.example';

interface RadarCard {
  variant: string;
  title: string;
}

/** Faithful replicas of the shadcn/ui radar charts, built with spartan-charts. */
@Component({
  selector: 'app-radar-shadcn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShadcnRadarExampleComponent],
  template: `
    <div class="shadcn-scope">
      <div class="mx-auto grid max-w-6xl gap-x-6 gap-y-12 pt-10 md:grid-cols-2 xl:grid-cols-3 items-start">
        @for (card of cards; track card.variant) {
          <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex.tsCode())">View Code</button>
            <div class="card-header centered">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-description">Showing total visitors for the last 6 months</div>
            </div>
            <div class="card-content centered-content">
              <app-shadcn-radar #ex [variant]="card.variant" />
            </div>
            <div class="card-footer centered-footer">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .shadcn-scope {
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: hsl(var(--card-foreground));
        padding: 2rem 1rem;
      }
      .vc-btn { position: absolute; top: -2.25rem; right: 0; font-size: 0.8125rem; font-weight: 500; color: hsl(var(--muted-foreground)); background: transparent; border: 1px solid hsl(var(--border)); border-radius: calc(var(--radius) - 2px); padding: 0.25rem 0.625rem; cursor: pointer; }
      .vc-btn:hover { color: hsl(var(--foreground)); background: hsl(var(--accent)); }
      .card {
        position: relative;
        background: hsl(var(--card));
        color: hsl(var(--card-foreground));
        border: 1px solid hsl(var(--border));
        border-radius: var(--radius);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-block: 1.5rem;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      }
      .card-header, .card-content, .card-footer { padding-inline: 1.5rem; }
      .centered { align-items: center; text-align: center; }
      .centered-content { display: flex; justify-content: center; padding-bottom: 0; }
      .centered-footer { align-items: center; text-align: center; }
      .card-title { font-weight: 600; font-size: 1rem; line-height: 1.5rem; }
      .card-description { color: hsl(var(--muted-foreground)); font-size: 0.875rem; line-height: 1.25rem; }
      .card-content app-shadcn-radar { display: block; width: 100%; max-width: 250px; font-size: 12px; }
      .card-footer { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem; line-height: 1.25rem; }
      .footer-trend { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; line-height: 1; }
      .footer-sub { color: hsl(var(--muted-foreground)); line-height: 1; }

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip {
        min-width: 8rem; display: grid; align-items: start; gap: 0.375rem;
        border-radius: 0.5rem; border: 1px solid hsl(var(--border) / 0.5);
        background: hsl(var(--background)); padding: 0.375rem 0.625rem;
        font-size: 0.75rem; line-height: 1rem;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        color: hsl(var(--foreground));
      }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .tt-label { font-weight: 500; color: hsl(var(--foreground)); }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .row { display: flex; width: 100%; align-items: center; gap: 0.5rem; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .indicator.line { width: 0.25rem; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .body { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 0.5rem; line-height: 1; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .name { color: hsl(var(--muted-foreground)); line-height: 1; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .value {
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1; color: hsl(var(--foreground));
      }
    `,
  ],
})
export class RadarShadcnComponent {
  protected readonly drawer = inject(CodeDrawerService);
  protected readonly cards: RadarCard[] = [
    { variant: 'default', title: 'Radar Chart' },
    { variant: 'lines-only', title: 'Radar Chart - Lines Only' },
    { variant: 'dots', title: 'Radar Chart - Dots' },
    { variant: 'multiple', title: 'Radar Chart - Multiple' },
    { variant: 'legend', title: 'Radar Chart - Legend' },
    { variant: 'grid-circle', title: 'Radar Chart - Grid Circle' },
    { variant: 'label-custom', title: 'Radar Chart - Custom Label' },
    { variant: 'grid-none', title: 'Radar Chart - Grid None' },
    { variant: 'grid-fill', title: 'Radar Chart - Grid Filled' },
    { variant: 'grid-custom', title: 'Radar Chart - Grid Custom' },
    { variant: 'grid-circle-no-lines', title: 'Radar Chart - Grid Circle - No lines' },
    { variant: 'icons', title: 'Radar Chart - Icons' },
    { variant: 'radius', title: 'Radar Chart - Radius Axis' },
  ];
}
