import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnScatterChart,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

interface ScatterDataPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-tooltip-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: `
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        name="Data Points"
        fill="#8884d8"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true" separator=" : " />
    </spn-scatter-chart>
  `,
  styles: [],
})
export class TooltipExampleComponent {
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
