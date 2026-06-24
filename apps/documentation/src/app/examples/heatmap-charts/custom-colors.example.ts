import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
} from '@spartan-ng/charts';

interface HeatmapDataPoint {
  month: string;
  category: string;
  value: number;
}

@Component({
  selector: 'app-custom-colors-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap],
  template: `
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="month" orientation="bottom" />
      <spn-y-axis dataKey="category" orientation="left" />
      <spn-heatmap
        xDataKey="month"
        yDataKey="category"
        valueDataKey="value"
        colorScheme="viridis"
        [cellPadding]="2"
        [cellRadius]="4"
      />
    </spn-heatmap-chart>
  `,
  styles: [],
})
export class CustomColorsHeatmapExampleComponent {
  protected readonly chartData: HeatmapDataPoint[] = [
    { month: 'Jan', category: 'Product A', value: 45 },
    { month: 'Jan', category: 'Product B', value: 78 },
    { month: 'Jan', category: 'Product C', value: 32 },
    { month: 'Feb', category: 'Product A', value: 62 },
    { month: 'Feb', category: 'Product B', value: 85 },
    { month: 'Feb', category: 'Product C', value: 41 },
    { month: 'Mar', category: 'Product A', value: 71 },
    { month: 'Mar', category: 'Product B', value: 93 },
    { month: 'Mar', category: 'Product C', value: 55 },
    { month: 'Apr', category: 'Product A', value: 89 },
    { month: 'Apr', category: 'Product B', value: 67 },
    { month: 'Apr', category: 'Product C', value: 72 },
    { month: 'May', category: 'Product A', value: 95 },
    { month: 'May', category: 'Product B', value: 54 },
    { month: 'May', category: 'Product C', value: 88 },
    { month: 'Jun', category: 'Product A', value: 78 },
    { month: 'Jun', category: 'Product B', value: 42 },
    { month: 'Jun', category: 'Product C', value: 96 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 80 };
}
