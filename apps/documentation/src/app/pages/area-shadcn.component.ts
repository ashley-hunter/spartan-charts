import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CodeDrawerService } from '../components/code-drawer.service';
import { ShadcnAreaExampleComponent } from '../examples/area-shadcn/shadcn-area.example';

/**
 * Faithful replicas of the shadcn/ui area charts, built with spartan-charts.
 * Goal: visually and interactively identical to https://ui.shadcn.com/charts/area
 * Each card uses shadcn's light theme (scoped via the `.shadcn-scope` wrapper).
 */
@Component({
  selector: 'app-area-shadcn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShadcnAreaExampleComponent],
  template: `
    <div class="shadcn-scope">
      <div class="mx-auto grid max-w-6xl gap-x-6 gap-y-12 pt-10 md:grid-cols-2 xl:grid-cols-3 items-start">
        <!-- Area Chart (default) -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex0.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex0 variant="default" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Linear -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex1.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart - Linear</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex1 variant="linear" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Step -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex2.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart - Step</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex2 variant="step" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Stacked -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex3.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart - Stacked</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex3 variant="stacked" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Stacked Expanded -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex4.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart - Stacked Expanded</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex4 variant="expand" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Legend -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex5.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart - Legend</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex5 variant="legend" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Icons -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex6.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart - Icons</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex6 variant="icons" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Gradient -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex7.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart - Gradient</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex7 variant="gradient" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Axes -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex8.tsCode())">View Code</button>
          <div class="card-header">
            <div class="card-title">Area Chart - Axes</div>
            <div class="card-description">
              Showing total visitors for the last 6 months
            </div>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex8 variant="axes" />
          </div>
          <div class="card-footer">
            <div class="footer-grid">
              <div class="footer-trend">
                Trending up by 5.2% this month
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="footer-sub">January - June 2024</div>
            </div>
          </div>
        </div>

        <!-- Area Chart - Interactive -->
        <div class="card">
            <button type="button" class="vc-btn" (click)="drawer.open(ex9.tsCode())">View Code</button>
          <div class="card-header interactive-header">
            <div class="header-text">
              <div class="card-title">Area Chart - Interactive</div>
              <div class="card-description">
                Showing total visitors for the last {{ rangeLabel() }}
              </div>
            </div>
            <select
              class="range-select"
              [value]="range()"
              (change)="range.set(+$any($event.target).value)"
              aria-label="Select a value"
            >
              <option value="90">Last 3 months</option>
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
            </select>
          </div>
          <div class="card-content">
            <app-shadcn-area #ex9 variant="interactive" [rangeDays]="range()" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .shadcn-scope {
        /* Inherits the global shadcn theme tokens so it flips with light/dark */
        font-family:
          ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto,
          Helvetica, Arial, sans-serif;
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
        box-shadow:
          0 1px 2px 0 rgb(0 0 0 / 0.05);
      }

      .card-header,
      .card-content,
      .card-footer {
        padding-inline: 1.5rem;
      }

      .interactive-header {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.375rem;
        border-bottom: 1px solid hsl(var(--border));
        padding-bottom: 1.25rem;
      }
      .interactive-header .header-text {
        display: grid;
        gap: 0.375rem;
        flex: 1;
      }
      .range-select {
        /* shadcn hides the range Select on mobile (hidden sm:flex) - the chart
           still defaults to the last 3 months. */
        display: none;
        height: 2rem;
        width: 10rem;
        border-radius: var(--radius);
        border: 1px solid hsl(var(--border));
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        font-size: 0.875rem;
        padding: 0 0.625rem;
        line-height: 1;
      }
      @media (min-width: 640px) {
        .interactive-header {
          flex-direction: row;
          align-items: center;
          gap: 1rem;
        }
        .range-select {
          display: block;
          margin-left: auto;
        }
      }

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

      .card-content app-shadcn-area {
        display: block;
        width: 100%;
        font-size: 12px;
      }

      .card-footer {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .footer-grid {
        display: grid;
        gap: 0.5rem;
        width: 100%;
      }

      .footer-trend {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        line-height: 1;
      }

      .footer-sub {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: hsl(var(--muted-foreground));
        line-height: 1;
      }

      /* shadcn tooltip (ChartTooltipContent, indicator="line") */
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

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .row {
        display: flex;
        width: 100%;
        align-items: stretch;
        gap: 0.5rem;
      }

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .indicator {
        width: 0.25rem;
        align-self: stretch;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .row-dot {
        align-items: center;
      }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .indicator.dot {
        width: 0.625rem;
        height: 0.625rem;
        align-self: center;
      }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .tlabel {
        font-weight: 500;
      }
      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .body.nest {
        align-items: flex-end;
      }

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .body {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        line-height: 1;
      }

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .labels {
        display: grid;
        gap: 0.375rem;
      }

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .label {
        font-weight: 500;
        color: hsl(var(--foreground));
      }

      .shadcn-scope ::ng-deep .spn-shadcn-tooltip .name {
        color: hsl(var(--muted-foreground));
        line-height: 1;
      }

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
export class AreaShadcnComponent {
  protected readonly drawer = inject(CodeDrawerService);
  protected readonly range = signal(90);
  protected rangeLabel(): string {
    return this.range() === 90 ? '3 months' : this.range() === 30 ? '30 days' : '7 days';
  }
}
