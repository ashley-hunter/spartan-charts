import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  revenue: number;
  profit: number;
}

@Component({
  selector: 'app-bar-with-tooltip-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: `
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
      <spn-bar dataKey="profit" name="Profit" fill="#10b981" />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true" separator=" : " />
    </spn-bar-chart>
  `,
  styles: [],
})
export class BarWithTooltipExampleComponent {
  protected readonly chartData: ChartDataPoint[] = [
    { name: 'Jan', revenue: 400, profit: 240 },
    { name: 'Feb', revenue: 300, profit: 139 },
    { name: 'Mar', revenue: 200, profit: 180 },
    { name: 'Apr', revenue: 278, profit: 190 },
    { name: 'May', revenue: 189, profit: 120 },
    { name: 'Jun', revenue: 239, profit: 180 },
    { name: 'Jul', revenue: 349, profit: 230 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
