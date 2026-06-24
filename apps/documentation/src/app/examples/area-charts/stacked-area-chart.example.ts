import { Component } from '@angular/core';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
  SpnLegend,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-stacked-area-chart-example',

  imports: [SpnAreaChart, SpnXAxis, SpnYAxis, SpnArea, SpnCartesianGrid, SpnLegend],
  template: `
    <spn-area-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-area dataKey="revenue" name="Revenue" fill="#3b82f6" stroke="#3b82f6" stackId="stack1" fillOpacity="0.6" />
      <spn-area dataKey="profit" name="Profit" fill="#10b981" stroke="#10b981" stackId="stack1" fillOpacity="0.6" />
      <spn-area dataKey="expenses" name="Expenses" fill="#f59e0b" stroke="#f59e0b" stackId="stack1" fillOpacity="0.6" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-area-chart>
  `,
})
export class StackedAreaChartExampleComponent {
  protected readonly chartData = [
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
