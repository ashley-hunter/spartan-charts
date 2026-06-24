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
  selector: 'app-multi-series-area-example',

  imports: [SpnAreaChart, SpnXAxis, SpnYAxis, SpnArea, SpnCartesianGrid, SpnLegend],
  template: `
    <spn-area-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-area dataKey="series1" name="Series A" fill="#3b82f6" stroke="#3b82f6" fillOpacity="0.3" />
      <spn-area dataKey="series2" name="Series B" fill="#10b981" stroke="#10b981" fillOpacity="0.3" />
      <spn-area dataKey="series3" name="Series C" fill="#f59e0b" stroke="#f59e0b" fillOpacity="0.3" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-area-chart>
  `,
})
export class MultiSeriesAreaExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', series1: 400, series2: 240, series3: 180 },
    { name: 'Feb', series1: 300, series2: 339, series3: 220 },
    { name: 'Mar', series1: 200, series2: 280, series3: 150 },
    { name: 'Apr', series1: 278, series2: 190, series3: 310 },
    { name: 'May', series1: 189, series2: 320, series3: 250 },
    { name: 'Jun', series1: 239, series2: 180, series3: 280 },
    { name: 'Jul', series1: 349, series2: 230, series3: 200 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
