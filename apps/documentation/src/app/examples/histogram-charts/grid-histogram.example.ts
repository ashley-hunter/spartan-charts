import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
  SpnReferenceLine,
} from '@spartan-ng/charts';

interface DataPoint {
  temperature: number;
}

@Component({
  selector: 'app-grid-histogram-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid, SpnReferenceLine],
  template: `
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" [horizontal]="true" [vertical]="true" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram
        dataKey="temperature"
        fill="#06b6d4"
        name="Temperature Distribution"
        [binCount]="12"
      />
      <spn-reference-line x="75" stroke="#ef4444" strokeDasharray="5 5" label="Avg: 75°F" />
    </spn-histogram-chart>
  `,
  styles: [],
})
export class GridHistogramExampleComponent {
  protected readonly chartData: DataPoint[] = this.generateTemperatureData(60);

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  private generateTemperatureData(count: number): DataPoint[] {
    const data: DataPoint[] = [];
    for (let i = 0; i < count; i++) {
      // Generate temperatures around 75°F with some variance
      const temperature = Math.round(75 + (Math.random() - 0.5) * 30);
      data.push({ temperature });
    }
    return data;
  }
}
