import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

interface MultiSeriesDataPoint {
  x: number;
  groupA: number;
  groupB: number;
}

@Component({
  selector: 'app-multi-series-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid, SpnLegend],
  template: `
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="groupA" orientation="left" type="number" />
      <spn-scatter xDataKey="x" yDataKey="groupA" name="Group A" fill="#8884d8" />
      <spn-scatter xDataKey="x" yDataKey="groupB" name="Group B" fill="#82ca9d" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-scatter-chart>
  `,
  styles: [],
})
export class MultiSeriesExampleComponent {
  protected readonly chartData: MultiSeriesDataPoint[] = [
    { x: 100, groupA: 200, groupB: 150 },
    { x: 120, groupA: 100, groupB: 230 },
    { x: 170, groupA: 300, groupB: 180 },
    { x: 140, groupA: 250, groupB: 290 },
    { x: 150, groupA: 400, groupB: 350 },
    { x: 110, groupA: 280, groupB: 200 },
    { x: 180, groupA: 320, groupB: 270 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
