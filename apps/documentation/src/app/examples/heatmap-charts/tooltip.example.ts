import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
  SpnTooltip,
  SpnCartesianGrid,
} from '@spartan-ng/charts';

interface HeatmapDataPoint {
  day: string;
  hour: string;
  value: number;
}

@Component({
  selector: 'app-tooltip-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap, SpnTooltip, SpnCartesianGrid],
  template: `
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" />
      <spn-heatmap
        xDataKey="hour"
        yDataKey="day"
        valueDataKey="value"
        name="Activity"
        colorScheme="plasma"
        [cellPadding]="1"
      />
      <spn-tooltip separator=": " />
    </spn-heatmap-chart>
  `,
  styles: [],
})
export class TooltipHeatmapExampleComponent {
  protected readonly chartData: HeatmapDataPoint[] = this.generateData();

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 60 };

  private generateData(): HeatmapDataPoint[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
    const data: HeatmapDataPoint[] = [];

    days.forEach((day) => {
      hours.forEach((hour) => {
        // Simulate higher activity during work hours
        const baseValue = ['10am', '11am', '2pm', '3pm'].includes(hour) ? 60 : 30;
        const variance = Math.floor(Math.random() * 40);
        data.push({
          day,
          hour,
          value: baseValue + variance,
        });
      });
    });

    return data;
  }
}
