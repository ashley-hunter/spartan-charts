import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnLegendItemDef,
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
  selector: 'app-custom-legend-example',
  imports: [
    SpnLineChart,
    SpnXAxis,
    SpnYAxis,
    SpnLine,
    SpnCartesianGrid,
    SpnLegend,
    SpnLegendItemDef,
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
        <ng-template spnLegendItem let-item let-onClick="onClick" let-index="index">
          <button
            class="legend-pill"
            [class.inactive]="item.inactive"
            [style.border-color]="item.color"
            (click)="onClick()"
          >
            <span class="legend-dot" [style.background]="item.color"></span>
            {{ item.value }}
          </button>
        </ng-template>
      </spn-legend>
      <spn-tooltip [cursor]="true" />
    </spn-line-chart>
  `,
  styles: [
    `
      .legend-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border: 2px solid;
        border-radius: 20px;
        background: transparent;
        font-size: 13px;
        font-weight: 500;
        color: #e2e8f0;
        cursor: pointer;
        transition: all 0.2s;
      }

      .legend-pill:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .legend-pill.inactive {
        opacity: 0.4;
      }

      .legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
    `,
  ],
})
export class CustomLegendExampleComponent {
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
