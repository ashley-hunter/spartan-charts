import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnLegendIconDef,
  SpnLineChart,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  value: number;
  amount: number;
}

@Component({
  selector: 'app-custom-legend-icon-example',
  imports: [
    SpnLineChart,
    SpnXAxis,
    SpnYAxis,
    SpnLine,
    SpnCartesianGrid,
    SpnLegend,
    SpnLegendIconDef,
    SpnTooltip,
  ],
  template: `
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line
        dataKey="value"
        name="Revenue"
        stroke="#3b82f6"
        strokeWidth="2"
        curve="monotoneX"
      />
      <spn-line
        dataKey="amount"
        name="Profit"
        stroke="#10b981"
        strokeWidth="2"
        curve="monotoneX"
      />
      <spn-legend align="center" verticalAlign="top">
        <ng-template spnLegendIcon let-item let-iconSize="iconSize">
          <!-- Custom rounded square icon -->
          <svg [attr.width]="iconSize" [attr.height]="iconSize">
            <rect
              [attr.width]="iconSize"
              [attr.height]="iconSize"
              [attr.fill]="item.color"
              rx="3"
              ry="3"
            />
          </svg>
        </ng-template>
      </spn-legend>
      <spn-tooltip [cursor]="true" />
    </spn-line-chart>
  `,
  styles: [],
})
export class CustomLegendIconExampleComponent {
  protected readonly chartData: ChartDataPoint[] = [
    { name: 'Jan', value: 400, amount: 240 },
    { name: 'Feb', value: 300, amount: 139 },
    { name: 'Mar', value: 200, amount: 380 },
    { name: 'Apr', value: 278, amount: 390 },
    { name: 'May', value: 189, amount: 480 },
    { name: 'Jun', value: 239, amount: 380 },
    { name: 'Jul', value: 349, amount: 430 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
