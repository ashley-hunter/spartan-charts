import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

interface DataPoint {
  salary: number;
}

@Component({
  selector: 'app-custom-thresholds-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid],
  template: `
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram
        dataKey="salary"
        fill="#10b981"
        [thresholds]="salaryThresholds"
        name="Salary Distribution"
      />
    </spn-histogram-chart>
  `,
  styles: [],
})
export class CustomThresholdsExampleComponent {
  // Custom salary brackets (in thousands)
  protected readonly salaryThresholds = [30, 40, 50, 60, 75, 90, 110, 130, 150];

  protected readonly chartData: DataPoint[] = [
    { salary: 35 }, { salary: 42 }, { salary: 48 }, { salary: 55 },
    { salary: 62 }, { salary: 58 }, { salary: 45 }, { salary: 72 },
    { salary: 85 }, { salary: 95 }, { salary: 68 }, { salary: 52 },
    { salary: 78 }, { salary: 88 }, { salary: 105 }, { salary: 115 },
    { salary: 125 }, { salary: 98 }, { salary: 65 }, { salary: 55 },
    { salary: 48 }, { salary: 58 }, { salary: 70 }, { salary: 82 },
    { salary: 92 }, { salary: 75 }, { salary: 60 }, { salary: 50 },
    { salary: 45 }, { salary: 38 }, { salary: 135 }, { salary: 145 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
