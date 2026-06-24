import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CodeDrawerService } from '../components/code-drawer.service';
import { ShadcnPieExampleComponent } from '../examples/pie-shadcn/shadcn-pie.example';

/** Faithful replicas of the shadcn/ui pie charts, built with spartan-charts. */
@Component({
  selector: 'app-pie-shadcn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShadcnPieExampleComponent],
  template: `
    <div class="shadcn-scope">
      <div class="mx-auto grid max-w-6xl gap-x-6 gap-y-12 pt-10 md:grid-cols-2 xl:grid-cols-3 items-start">
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex0.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex0 variant="simple" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">
              Trending up by 5.2% this month
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex1.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Donut</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex1 variant="donut" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">Trending up by 5.2% this month</div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex2.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Donut with Text</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex2 variant="donut-text" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">Trending up by 5.2% this month</div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex3.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Label</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex3 variant="label" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">Trending up by 5.2% this month</div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex4.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Stacked</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex4 variant="stacked" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">Trending up by 5.2% this month</div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex5.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Legend</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex5 variant="legend" />
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex6.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Donut Active</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex6 variant="donut-active" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">Trending up by 5.2% this month</div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex7.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Label List</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex7 variant="label-list" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">Trending up by 5.2% this month</div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex8.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Custom Label</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex8 variant="label-custom" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">Trending up by 5.2% this month</div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex9.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Separator None</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex9 variant="separator-none" />
          </div>
          <div class="card-footer centered-footer">
            <div class="footer-trend">Trending up by 5.2% this month</div>
            <div class="footer-sub">Showing total visitors for the last 6 months</div>
          </div>
        </div>

        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex10.tsCode())">View Code</button>
          <div class="card-header centered">
            <div class="card-title">Pie Chart - Interactive</div>
            <div class="card-description">January - June 2024</div>
          </div>
          <div class="card-content centered-content">
            <app-shadcn-pie #ex10 variant="interactive" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .shadcn-scope {
        font-family:
          ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica,
          Arial, sans-serif;
        color: hsl(var(--card-foreground));
        padding: 2rem 1rem;
      }
      .vc-btn { position: absolute; top: -2.25rem; right: 0; font-size: 0.8125rem; font-weight: 500; color: hsl(var(--muted-foreground)); background: transparent; border: 1px solid hsl(var(--border)); border-radius: calc(var(--radius) - 2px); padding: 0.25rem 0.625rem; cursor: pointer; }
      .vc-btn:hover { color: hsl(var(--foreground)); background: hsl(var(--accent)); }
      .card { position: relative;
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
      .card-header,
      .card-content,
      .card-footer {
        padding-inline: 1.5rem;
      }
      .centered { align-items: center; text-align: center; }
      .centered-content { display: flex; justify-content: center; padding-bottom: 0; }
      .centered-footer { align-items: center; text-align: center; }
      .card-title {
        font-weight: 600;
        font-size: 1rem;
        line-height: 1.5rem;
      }
      .card-description {
        color: hsl(var(--muted-foreground));
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      .card-content app-shadcn-pie {
        display: block;
        width: 100%;
        max-width: 300px;
        font-size: 12px;
      }
      .card-footer {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      .footer-trend {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        line-height: 1;
      }
      .footer-sub {
        color: hsl(var(--muted-foreground));
        line-height: 1;
      }

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip {
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
        box-shadow:
          0 20px 25px -5px rgb(0 0 0 / 0.1),
          0 8px 10px -6px rgb(0 0 0 / 0.1);
        color: hsl(var(--foreground));
      }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .row { display: flex; width: 100%; align-items: stretch; gap: 0.5rem; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .row-dot { align-items: center; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .indicator { flex-shrink: 0; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .indicator.dot { width: 0.625rem; height: 0.625rem; border-radius: 2px; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .body { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 0.5rem; line-height: 1; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .name { color: hsl(var(--muted-foreground)); line-height: 1; }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .value {
        font-family:
          ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        color: hsl(var(--foreground));
      }
    `,
  ],
})
export class PieShadcnComponent {
  protected readonly drawer = inject(CodeDrawerService);
}
