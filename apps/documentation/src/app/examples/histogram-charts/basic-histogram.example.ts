import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

interface DataPoint {
  age: number;
}

@Component({
  selector: 'app-basic-histogram-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram],
  template: `
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram dataKey="age" fill="#3b82f6" />
    </spn-histogram-chart>
  `,
  styles: [],
})
export class BasicHistogramExampleComponent {
  protected readonly chartData: DataPoint[] = [
    { age: 23 }, { age: 25 }, { age: 31 }, { age: 28 },
    { age: 35 }, { age: 42 }, { age: 38 }, { age: 29 },
    { age: 45 }, { age: 52 }, { age: 33 }, { age: 27 },
    { age: 24 }, { age: 36 }, { age: 41 }, { age: 30 },
    { age: 26 }, { age: 34 }, { age: 39 }, { age: 48 },
    { age: 22 }, { age: 37 }, { age: 44 }, { age: 32 },
    { age: 29 }, { age: 35 }, { age: 40 }, { age: 28 },
    { age: 31 }, { age: 46 }, { age: 33 }, { age: 25 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
