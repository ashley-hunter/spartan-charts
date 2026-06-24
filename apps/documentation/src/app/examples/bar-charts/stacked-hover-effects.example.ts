import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
  SpnTooltip,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  revenue: number;
  profit: number;
  expenses: number;
}

@Component({
  selector: 'app-stacked-hover-effects-example',
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: `
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar
        dataKey="revenue"
        name="Revenue"
        fill="#3b82f6"
        hoverFill="#60a5fa"
        stackId="stack1"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
      />
      <spn-bar
        dataKey="profit"
        name="Profit"
        fill="#10b981"
        hoverFill="#34d399"
        stackId="stack1"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
      />
      <spn-bar
        dataKey="expenses"
        name="Expenses"
        fill="#f59e0b"
        hoverFill="#fbbf24"
        stackId="stack1"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
        [radius]="[4, 4, 0, 0]"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip />
    </spn-bar-chart>
  `,
  styles: [],
})
export class StackedHoverEffectsExampleComponent {
  protected readonly chartData: ChartDataPoint[] = [
    { name: 'Jan', revenue: 400, profit: 240, expenses: 100 },
    { name: 'Feb', revenue: 300, profit: 139, expenses: 80 },
    { name: 'Mar', revenue: 200, profit: 180, expenses: 120 },
    { name: 'Apr', revenue: 278, profit: 190, expenses: 90 },
    { name: 'May', revenue: 189, profit: 120, expenses: 70 },
    { name: 'Jun', revenue: 239, profit: 180, expenses: 110 },
    { name: 'Jul', revenue: 349, profit: 230, expenses: 130 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
