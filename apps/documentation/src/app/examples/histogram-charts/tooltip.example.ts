import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

interface DataPoint {
  responseTime: number;
}

@Component({
  selector: 'app-histogram-tooltip-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: `
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram
        dataKey="responseTime"
        fill="#f59e0b"
        name="Response Time (ms)"
        [binCount]="10"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true" separator=" : " />
    </spn-histogram-chart>
  `,
  styles: [],
})
export class HistogramTooltipExampleComponent {
  protected readonly chartData: DataPoint[] = this.generateResponseTimeData(150);

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  private generateResponseTimeData(count: number): DataPoint[] {
    const data: DataPoint[] = [];
    for (let i = 0; i < count; i++) {
      // Most response times cluster around 100-200ms with some outliers
      let responseTime: number;
      const rand = Math.random();
      if (rand < 0.7) {
        // 70% normal responses
        responseTime = 100 + Math.random() * 100;
      } else if (rand < 0.9) {
        // 20% slower responses
        responseTime = 200 + Math.random() * 150;
      } else {
        // 10% slow outliers
        responseTime = 350 + Math.random() * 150;
      }
      data.push({ responseTime: Math.round(responseTime) });
    }
    return data;
  }
}
