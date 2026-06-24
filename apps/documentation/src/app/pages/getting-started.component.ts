import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../components/code-block.component';

@Component({
  selector: 'app-getting-started',

  imports: [RouterLink, CodeBlockComponent],
  template: `
    <div class="space-y-12">
      <div>
        <h1 class="text-4xl font-bold tracking-tight text-foreground mb-4">
          Getting Started
        </h1>
        <p class="text-xl text-muted-foreground">
          Learn how to install and use Spartan Charts in your Angular
          project.
        </p>
      </div>

      <!-- Installation -->
      <section class="space-y-6">
        <h2 class="text-3xl font-bold text-foreground">Installation</h2>
        <p class="text-muted-foreground">
          Install Spartan Charts via npm or yarn:
        </p>

        <div
          class="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div class="bg-muted px-6 py-3 border-b border-border">
            <span class="text-sm font-medium text-muted-foreground">npm</span>
          </div>
          <app-code-block
            [code]="installCode"
            language="bash"
            theme="github-dark"
          />
        </div>

        <p class="text-muted-foreground text-sm">
          Note: D3 is a peer dependency and must be installed separately.
        </p>
      </section>

      <!-- Basic Usage -->
      <section class="space-y-6">
        <h2 class="text-3xl font-bold text-foreground">Basic Usage</h2>
        <p class="text-muted-foreground">
          Import the components you need in your Angular component:
        </p>

        <div
          class="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div class="bg-muted px-6 py-3 border-b border-border">
            <span class="text-sm font-medium text-muted-foreground">TypeScript</span>
          </div>
          <app-code-block
            [code]="importExample"
            language="typescript"
            theme="github-dark"
          />
        </div>
      </section>

      <!-- First Chart -->
      <section class="space-y-6">
        <h2 class="text-3xl font-bold text-foreground">Your First Chart</h2>
        <p class="text-muted-foreground">
          Here's a complete example of creating a simple line chart:
        </p>

        <div
          class="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div class="bg-muted px-6 py-3 border-b border-border">
            <span class="text-sm font-medium text-muted-foreground">TypeScript</span>
          </div>
          <app-code-block
            [code]="componentExample"
            language="typescript"
            theme="github-dark"
          />
        </div>
      </section>

      <!-- Key Concepts -->
      <section class="space-y-6">
        <h2 class="text-3xl font-bold text-foreground">Key Concepts</h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-card/50 rounded-xl border border-border p-6">
            <h3 class="text-xl font-bold mb-3 text-foreground">
              Composable Architecture
            </h3>
            <p class="text-muted-foreground">
              Spartan Charts uses a composable architecture where
              child components provide configuration to parent chart components.
              This is similar to how Recharts works in React.
            </p>
          </div>

          <div class="bg-card/50 rounded-xl border border-border p-6">
            <h3 class="text-xl font-bold mb-3 text-foreground">
              Signal-Based Reactivity
            </h3>
            <p class="text-muted-foreground">
              All component inputs use Angular signals, providing fine-grained
              reactivity and optimal performance. Charts automatically update
              when data or configuration changes.
            </p>
          </div>

          <div class="bg-card/50 rounded-xl border border-border p-6">
            <h3 class="text-xl font-bold mb-3 text-foreground">
              Declarative API
            </h3>
            <p class="text-muted-foreground">
              Define your charts declaratively in your templates. The chart
              components handle all the complex D3 rendering logic for you.
            </p>
          </div>

          <div class="bg-card/50 rounded-xl border border-border p-6">
            <h3 class="text-xl font-bold mb-3 text-foreground">
              D3 Integration
            </h3>
            <p class="text-muted-foreground">
              Built on top of D3.js, leveraging its powerful data visualization
              capabilities while providing an Angular-friendly API.
            </p>
          </div>
        </div>
      </section>

      <!-- Next Steps -->
      <section class="bg-card/50 rounded-2xl border border-border p-8">
        <h2 class="text-2xl font-bold mb-4 text-foreground">Next Steps</h2>
        <p class="text-muted-foreground mb-6">Explore more features and examples:</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a
            routerLink="/charts/area-shadcn"
            class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all"
          >
            View Line Chart Examples
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
            routerLink="/charts/bar-shadcn"
            class="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:border-border text-muted-foreground hover:text-foreground font-medium transition-all"
          >
            Explore Components
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class GettingStartedComponent {
  protected readonly installCode = 'npm install @spartan-ng/charts d3';

  protected readonly importExample = `import { Component } from '@angular/core';
import { SpnLineChart, SpnXAxis, SpnYAxis, SpnLine } from '@spartan-ng/charts';

@Component({
  selector: 'app-chart-demo',

  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine],
  // ...
})
export class ChartDemoComponent {
  // ...
}`;

  protected readonly componentExample = `import { Component } from '@angular/core';
import { SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid } from '@spartan-ng/charts';

@Component({
  selector: 'app-chart-demo',

  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid],
  template: \`
    <spn-line-chart [data]="chartData" width="600" height="400">
      <spn-cartesian-grid stroke="#e0e0e0" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" stroke="#8884d8" strokeWidth="2" />
    </spn-line-chart>
  \`,
})
export class ChartDemoComponent {
  chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
  ];
}`;
}
