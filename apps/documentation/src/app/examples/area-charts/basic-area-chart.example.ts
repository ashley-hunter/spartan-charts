import { Component } from '@angular/core';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basic-area-chart-example',

  imports: [SpnAreaChart, SpnXAxis, SpnYAxis, SpnArea, SpnCartesianGrid],
  template: `
    <spn-area-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-area dataKey="value" fill="#3b82f6" stroke="#3b82f6" fillOpacity="0.4" />
    </spn-area-chart>
  `,
})
export class BasicAreaChartExampleComponent {
  protected readonly chartData = [
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
