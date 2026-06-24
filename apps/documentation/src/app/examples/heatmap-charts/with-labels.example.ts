import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
  SpnTooltip,
} from '@spartan-ng/charts';

interface HeatmapDataPoint {
  day: string;
  hour: string;
  value: number;
}

@Component({
  selector: 'app-with-labels-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap, SpnTooltip],
  template: `
    <spn-heatmap-chart [data]="chartData" width="700" height="350" [margin]="margin">
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" />
      <spn-heatmap
        xDataKey="hour"
        yDataKey="day"
        valueDataKey="value"
        colorScheme="blues"
        [label]="true"
        [cellPadding]="2"
      />
      <spn-tooltip separator=": " />
    </spn-heatmap-chart>
  `,
  styles: [],
})
export class WithLabelsHeatmapExampleComponent {
  protected readonly chartData: HeatmapDataPoint[] = [
    { day: 'Mon', hour: '9am', value: 45 },
    { day: 'Mon', hour: '10am', value: 78 },
    { day: 'Mon', hour: '11am', value: 92 },
    { day: 'Mon', hour: '12pm', value: 65 },
    { day: 'Mon', hour: '1pm', value: 42 },
    { day: 'Tue', hour: '9am', value: 32 },
    { day: 'Tue', hour: '10am', value: 85 },
    { day: 'Tue', hour: '11am', value: 88 },
    { day: 'Tue', hour: '12pm', value: 55 },
    { day: 'Tue', hour: '1pm', value: 38 },
    { day: 'Wed', hour: '9am', value: 28 },
    { day: 'Wed', hour: '10am', value: 72 },
    { day: 'Wed', hour: '11am', value: 95 },
    { day: 'Wed', hour: '12pm', value: 68 },
    { day: 'Wed', hour: '1pm', value: 45 },
    { day: 'Thu', hour: '9am', value: 52 },
    { day: 'Thu', hour: '10am', value: 88 },
    { day: 'Thu', hour: '11am', value: 76 },
    { day: 'Thu', hour: '12pm', value: 62 },
    { day: 'Thu', hour: '1pm', value: 35 },
    { day: 'Fri', hour: '9am', value: 38 },
    { day: 'Fri', hour: '10am', value: 65 },
    { day: 'Fri', hour: '11am', value: 72 },
    { day: 'Fri', hour: '12pm', value: 48 },
    { day: 'Fri', hour: '1pm', value: 25 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 60 };
}
