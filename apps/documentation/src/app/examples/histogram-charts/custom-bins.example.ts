import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

interface DataPoint {
  score: number;
}

@Component({
  selector: 'app-custom-bins-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid],
  template: `
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram dataKey="score" fill="#8b5cf6" [binCount]="15" />
    </spn-histogram-chart>
  `,
  styles: [],
})
export class CustomBinsExampleComponent {
  protected readonly chartData: DataPoint[] = this.generateScoreData(100);

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  private generateScoreData(count: number): DataPoint[] {
    const data: DataPoint[] = [];
    for (let i = 0; i < count; i++) {
      // Generate scores with a normal-ish distribution around 70
      const score = Math.round(
        Math.min(100, Math.max(0, 70 + (Math.random() - 0.5) * 40 + (Math.random() - 0.5) * 20))
      );
      data.push({ score });
    }
    return data;
  }
}
