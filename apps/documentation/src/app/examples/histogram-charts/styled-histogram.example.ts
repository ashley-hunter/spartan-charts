import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

interface DataPoint {
  value: number;
}

@Component({
  selector: 'app-styled-histogram-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid],
  template: `
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram
        dataKey="value"
        fill="#ec4899"
        stroke="#be185d"
        strokeWidth="2"
        opacity="0.8"
        [binCount]="12"
      />
    </spn-histogram-chart>
  `,
  styles: [],
})
export class StyledHistogramExampleComponent {
  protected readonly chartData: DataPoint[] = this.generateData(80);

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  private generateData(count: number): DataPoint[] {
    const data: DataPoint[] = [];
    for (let i = 0; i < count; i++) {
      // Generate values with some variance
      const value = Math.round(50 + Math.random() * 100 - 25);
      data.push({ value });
    }
    return data;
  }
}
