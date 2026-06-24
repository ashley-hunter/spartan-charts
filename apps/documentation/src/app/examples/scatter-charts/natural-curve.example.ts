import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
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
  selector: 'app-natural-curve-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: `
    <spn-scatter-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        fill="#3b82f6"
        [line]="true"
        lineStrokeWidth="2"
        lineCurve="natural"
      />
    </spn-scatter-chart>
  `,
  styles: [],
})
export class NaturalCurveExampleComponent {
  protected readonly chartData: ScatterDataPoint[] = [
    { x: 10, y: 30 },
    { x: 30, y: 80 },
    { x: 45, y: 50 },
    { x: 60, y: 120 },
    { x: 80, y: 90 },
    { x: 100, y: 150 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
