import { Component } from '@angular/core';
import {
  SpnLineChart,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  value: number;
}

@Component({
  selector: 'app-basic-line-chart-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine],
  template: `
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" />
    </spn-line-chart>
  `,
  styles: [],
})
export class BasicLineChartExampleComponent {
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
