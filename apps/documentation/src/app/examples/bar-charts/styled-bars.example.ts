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
  selector: 'app-styled-bars-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid],
  template: `
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar
        dataKey="value"
        fill="#ec4899"
        stroke="#be185d"
        strokeWidth="2"
        [radius]="[8, 8, 0, 0]"
      />
    </spn-bar-chart>
  `,
  styles: [],
})
export class StyledBarsExampleComponent {
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
