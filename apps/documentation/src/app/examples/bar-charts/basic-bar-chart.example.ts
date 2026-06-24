import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  value: number;
}

@Component({
  selector: 'app-basic-bar-chart-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar],
  template: `
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar dataKey="value" fill="#3b82f6" />
    </spn-bar-chart>
  `,
  styles: [],
})
export class BasicBarChartExampleComponent {
  protected readonly chartData: ChartDataPoint[] = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
    { name: 'Jul', value: 349 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
