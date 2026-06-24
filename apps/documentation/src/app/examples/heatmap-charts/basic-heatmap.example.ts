import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
} from '@spartan-ng/charts';

interface HeatmapDataPoint {
  day: string;
  hour: string;
  value: number;
}

@Component({
  selector: 'app-basic-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap],
  template: `
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" />
      <spn-heatmap
        xDataKey="hour"
        yDataKey="day"
        valueDataKey="value"
        colorScheme="blues"
      />
    </spn-heatmap-chart>
  `,
  styles: [],
})
export class BasicHeatmapExampleComponent {
  protected readonly chartData: HeatmapDataPoint[] = this.generateData();

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 60 };

  private generateData(): HeatmapDataPoint[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
    const data: HeatmapDataPoint[] = [];

    days.forEach((day) => {
      hours.forEach((hour) => {
        data.push({
          day,
          hour,
          value: Math.floor(Math.random() * 100),
        });
      });
    });

    return data;
  }
}
