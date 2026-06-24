import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
  SpnTooltip,
  HeatmapLabelConfig,
} from '@spartan-ng/charts';

interface CorrelationDataPoint {
  var1: string;
  var2: string;
  correlation: number;
}

@Component({
  selector: 'app-correlation-matrix-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap, SpnTooltip],
  template: `
    <spn-heatmap-chart [data]="chartData" width="500" height="500" [margin]="margin">
      <spn-x-axis dataKey="var2" orientation="bottom" />
      <spn-y-axis dataKey="var1" orientation="left" />
      <spn-heatmap
        xDataKey="var2"
        yDataKey="var1"
        valueDataKey="correlation"
        name="Correlation"
        colorScheme="RdYlBu"
        [valueDomain]="[-1, 1]"
        [cellPadding]="2"
        [cellRadius]="2"
        [label]="labelConfig"
      />
      <spn-tooltip separator=": " />
    </spn-heatmap-chart>
  `,
  styles: [],
})
export class CorrelationMatrixExampleComponent {
  protected readonly chartData: CorrelationDataPoint[] = this.generateCorrelationMatrix();

  protected readonly margin = { top: 20, right: 30, bottom: 60, left: 80 };

  protected readonly labelConfig: HeatmapLabelConfig = {
    formatter: (value: number) => value.toFixed(2),
    fontSize: 11,
  };

  private generateCorrelationMatrix(): CorrelationDataPoint[] {
    const variables = ['Revenue', 'Marketing', 'R&D', 'Support', 'Sales'];
    const data: CorrelationDataPoint[] = [];

    // Pre-defined correlation values for a realistic matrix
    const correlations: Record<string, Record<string, number>> = {
      'Revenue': { 'Revenue': 1.0, 'Marketing': 0.85, 'R&D': 0.45, 'Support': 0.32, 'Sales': 0.92 },
      'Marketing': { 'Revenue': 0.85, 'Marketing': 1.0, 'R&D': 0.28, 'Support': 0.15, 'Sales': 0.78 },
      'R&D': { 'Revenue': 0.45, 'Marketing': 0.28, 'R&D': 1.0, 'Support': -0.12, 'Sales': 0.35 },
      'Support': { 'Revenue': 0.32, 'Marketing': 0.15, 'R&D': -0.12, 'Support': 1.0, 'Sales': 0.42 },
      'Sales': { 'Revenue': 0.92, 'Marketing': 0.78, 'R&D': 0.35, 'Support': 0.42, 'Sales': 1.0 },
    };

    variables.forEach((var1) => {
      variables.forEach((var2) => {
        data.push({
          var1,
          var2,
          correlation: correlations[var1][var2],
        });
      });
    });

    return data;
  }
}
