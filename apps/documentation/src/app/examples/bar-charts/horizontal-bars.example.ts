import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  value: number;
}

@Component({
  selector: 'app-horizontal-bars-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid],
  template: `
    <spn-bar-chart
      [data]="chartData"
      width="700"
      height="400"
      [margin]="margin"
      layout="horizontal"
    >
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis type="number" orientation="bottom" />
      <spn-y-axis dataKey="name" orientation="left" type="category" />
      <spn-bar dataKey="value" fill="#8b5cf6" />
    </spn-bar-chart>
  `,
  styles: [],
})
export class HorizontalBarsExampleComponent {
  protected readonly chartData: ChartDataPoint[] = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 200 },
    { name: 'Product D', value: 278 },
    { name: 'Product E', value: 189 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 80 };
}
