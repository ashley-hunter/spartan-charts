import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  SpnHeatmapChart,
  SpnHeatmap,
  SpnHeatmapLegend,
  SpnHeatmapLegendTickDef,
  SpnXAxis,
  SpnYAxis,
  SpnTooltip,
} from '@spartan-ng/charts';

interface HeatmapDataPoint {
  day: string;
  hour: number;
  value: number;
}

@Component({
  selector: 'app-custom-heatmap-legend-example',
  imports: [
    SpnHeatmapChart,
    SpnHeatmap,
    SpnHeatmapLegend,
    SpnHeatmapLegendTickDef,
    SpnXAxis,
    SpnYAxis,
    SpnTooltip,
    DecimalPipe,
  ],
  template: `
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" type="category" />
      <spn-heatmap xDataKey="hour" yDataKey="day" valueDataKey="value" colorScheme="blues" />
      <spn-heatmap-legend position="right" [tickCount]="5">
        <ng-template spnHeatmapLegendTick let-tick>
          <span class="custom-tick" [style]="tick.style">
            {{ tick.value | number:'1.0-0' }}%
          </span>
        </ng-template>
      </spn-heatmap-legend>
      <spn-tooltip />
    </spn-heatmap-chart>
  `,
  styles: [
    `
      .custom-tick {
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        padding: 2px 6px;
        background: rgba(100, 116, 139, 0.1);
        border-radius: 4px;
      }
    `,
  ],
})
export class CustomHeatmapLegendExampleComponent {
  protected readonly chartData: HeatmapDataPoint[] = this.generateHeatmapData();
  protected readonly margin = { top: 20, right: 80, bottom: 40, left: 80 };

  private generateHeatmapData(): HeatmapDataPoint[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data: HeatmapDataPoint[] = [];

    for (const day of days) {
      for (let hour = 0; hour < 24; hour++) {
        data.push({
          day,
          hour,
          value: Math.round(Math.random() * 100),
        });
      }
    }

    return data;
  }
}
