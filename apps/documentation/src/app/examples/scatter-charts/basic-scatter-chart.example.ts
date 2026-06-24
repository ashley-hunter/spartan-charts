import { Component } from '@angular/core';
import {
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

interface ScatterDataPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-basic-scatter-chart-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter],
  template: `
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter xDataKey="x" yDataKey="y" fill="#8884d8" />
    </spn-scatter-chart>
  `,
  styles: [],
})
export class BasicScatterChartExampleComponent {
  protected readonly chartData: ScatterDataPoint[] = [
    { x: 100, y: 200 },
    { x: 120, y: 100 },
    { x: 170, y: 300 },
    { x: 140, y: 250 },
    { x: 150, y: 400 },
    { x: 110, y: 280 },
    { x: 180, y: 320 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
