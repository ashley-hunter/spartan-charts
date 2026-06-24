import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLineChart,
  SpnReferenceLine,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  value: number;
}

@Component({
  selector: 'app-reference-lines-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnReferenceLine],
  template: `
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-reference-line
        [y]="targetValue"
        stroke="#ef4444"
        strokeDasharray="5 5"
        label="Target"
      />
      <spn-reference-line
        x="Apr"
        stroke="#8b5cf6"
        strokeDasharray="3 3"
        label="Q2"
      />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" />
    </spn-line-chart>
  `,
  styles: [],
})
export class ReferenceLinesExampleComponent {
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
  protected readonly targetValue = 350;
}
