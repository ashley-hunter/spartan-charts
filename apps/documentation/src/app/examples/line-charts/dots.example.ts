import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnLineChart,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  value: number;
  amount: number;
}

@Component({
  selector: 'app-dots-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: `
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line
        dataKey="value"
        name="Revenue"
        stroke="#3b82f6"
        strokeWidth="2"
        [dot]="true"
        dotSize="4"
        dotFill="#3b82f6"
        dotStroke="#fff"
        dotStrokeWidth="2"
        [activeDot]="true"
        activeDotSize="8"
        activeDotFill="#2563eb"
        activeDotStroke="#fff"
        activeDotStrokeWidth="2"
      />
      <spn-line
        dataKey="amount"
        name="Profit"
        stroke="#10b981"
        strokeWidth="2"
        [dot]="true"
        dotSize="4"
        dotFill="#10b981"
        dotStroke="#fff"
        dotStrokeWidth="2"
        [activeDot]="true"
        activeDotSize="8"
        activeDotFill="#059669"
        activeDotStroke="#fff"
        activeDotStrokeWidth="2"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip offset="10" />
    </spn-line-chart>
  `,
  styles: [],
})
export class DotsExampleComponent {
  protected readonly chartData: ChartDataPoint[] = [
    { name: 'Jan', value: 400, amount: 240 },
    { name: 'Feb', value: 300, amount: 139 },
    { name: 'Mar', value: 200, amount: 380 },
    { name: 'Apr', value: 278, amount: 390 },
    { name: 'May', value: 189, amount: 480 },
    { name: 'Jun', value: 239, amount: 380 },
    { name: 'Jul', value: 349, amount: 430 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
