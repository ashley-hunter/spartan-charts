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
  selector: 'app-hover-effects-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap, SpnTooltip],
  template: `
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" />
      <spn-heatmap
        xDataKey="hour"
        yDataKey="day"
        valueDataKey="value"
        name="Activity"
        colorScheme="blues"
        [cellPadding]="2"
        [cellRadius]="4"
        hoverStroke="#1e40af"
        [hoverStrokeWidth]="3"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
      />
      <spn-tooltip separator=": " />
    </spn-heatmap-chart>
  `,
  styles: [],
})
export class HoverEffectsHeatmapExampleComponent {
  protected readonly chartData: HeatmapDataPoint[] = this.generateData();
  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 60 };

  private generateData(): HeatmapDataPoint[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
    const data: HeatmapDataPoint[] = [];

    days.forEach((day) => {
      hours.forEach((hour) => {
        const baseValue = ['10am', '11am', '2pm', '3pm'].includes(hour) ? 60 : 30;
        data.push({ day, hour, value: baseValue + Math.floor(Math.random() * 40) });
      });
    });

    return data;
  }
}
