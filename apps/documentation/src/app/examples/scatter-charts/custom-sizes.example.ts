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
  selector: 'app-custom-sizes-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: `
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        name="Small"
        fill="#3b82f6"
        [size]="40"
        stroke="#1d4ed8"
        [strokeWidth]="2"
      />
      <spn-scatter
        [data]="chartData2"
        xDataKey="x"
        yDataKey="y"
        name="Medium"
        fill="#10b981"
        [size]="100"
        [opacity]="0.8"
      />
      <spn-scatter
        [data]="chartData3"
        xDataKey="x"
        yDataKey="y"
        name="Large"
        fill="#f59e0b"
        [size]="200"
        [opacity]="0.6"
        stroke="#d97706"
        [strokeWidth]="2"
      />
    </spn-scatter-chart>
  `,
  styles: [],
})
export class CustomSizesExampleComponent {
  protected readonly chartData: ScatterDataPoint[] = [
    { x: 50, y: 100 },
    { x: 80, y: 150 },
    { x: 110, y: 80 },
  ];

  protected readonly chartData2: ScatterDataPoint[] = [
    { x: 70, y: 200 },
    { x: 130, y: 250 },
    { x: 160, y: 180 },
  ];

  protected readonly chartData3: ScatterDataPoint[] = [
    { x: 100, y: 350 },
    { x: 150, y: 300 },
    { x: 180, y: 400 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
