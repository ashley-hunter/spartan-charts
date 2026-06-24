import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../components/code-block.component';
import { ShadcnAreaExampleComponent } from '../examples/area-shadcn/shadcn-area.example';

@Component({
  selector: 'app-home',

  imports: [RouterLink, CodeBlockComponent, ShadcnAreaExampleComponent],
  template: `
    <div class="space-y-16">
      <!-- Hero Section -->
      <section class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 rounded-3xl blur-3xl"
        ></div>
        <div class="relative py-16 text-center">
          <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span
              class="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
            >
              Spartan Charts
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A composable Angular charting library inspired by Recharts, built
            with D3 and Angular signals.
          </p>
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              routerLink="/getting-started"
              class="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all transform hover:scale-105 shadow-lg shadow-primary/50"
            >
              Get Started
              <svg
                class="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              routerLink="/charts/area-shadcn"
              class="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-border hover:border-border text-muted-foreground hover:text-foreground font-medium transition-all"
            >
              View Examples
            </a>
          </div>
        </div>
      </section>

      <!-- Quick Preview -->
      <section>
        <div class="bg-card/50 rounded-2xl border border-border p-8">
          <h2 class="text-2xl font-bold mb-6 text-foreground">Quick Preview</h2>
          <div class="mx-auto max-w-[460px] rounded-xl border border-border bg-card p-6 shadow-sm">
            <div class="mb-1 font-semibold text-card-foreground">Area Chart</div>
            <div class="mb-4 text-sm text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
            <app-shadcn-area variant="default" />
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="grid md:grid-cols-3 gap-8">
        <div class="bg-card/50 rounded-2xl border border-border p-8">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-3 text-foreground">Signal-Based</h3>
          <p class="text-muted-foreground">
            Built with Angular signals for fine-grained reactivity and optimal
            performance.
          </p>
        </div>

        <div class="bg-card/50 rounded-2xl border border-border p-8">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-3 text-foreground">Composable</h3>
          <p class="text-muted-foreground">
            Declarative API with reusable components that work together
            seamlessly.
          </p>
        </div>

        <div class="bg-card/50 rounded-2xl border border-border p-8">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-3 text-foreground">D3 Powered</h3>
          <p class="text-muted-foreground">
            Leverages the power of D3.js for robust data visualization
            capabilities.
          </p>
        </div>
      </section>

      <!-- Code Example -->
      <section>
        <h2 class="text-3xl font-bold mb-6 text-foreground">Simple to Use</h2>
        <div
          class="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div
            class="bg-muted px-6 py-3 border-b border-border flex items-center justify-between"
          >
            <span class="text-sm font-medium text-muted-foreground"
              >Angular Template</span
            >
          </div>
          <app-code-block [code]="codeExample" language="angular-html" />
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class HomeComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400, amount: 240 },
    { name: 'Feb', value: 300, amount: 139 },
    { name: 'Mar', value: 200, amount: 380 },
    { name: 'Apr', value: 278, amount: 390 },
    { name: 'May', value: 189, amount: 480 },
    { name: 'Jun', value: 239, amount: 380 },
    { name: 'Jul', value: 349, amount: 430 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  protected readonly codeExample = `<spn-line-chart [data]="chartData" width="600" height="400">
  <spn-cartesian-grid stroke="#e0e0e0" strokeDasharray="3 3" />
  <spn-x-axis dataKey="name" orientation="bottom" />
  <spn-y-axis dataKey="value" orientation="left" />
  <spn-line
    dataKey="value"
    stroke="#3b82f6"
    strokeWidth="2"
    curve="monotoneX"
  />
  <spn-tooltip [cursor]="true" />
</spn-line-chart>`;
}
