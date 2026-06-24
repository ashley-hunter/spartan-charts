import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnLineChart,
  SpnTooltip,
  SpnTooltipContentDef,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
  TooltipPayload,
} from '@spartan-ng/charts';

interface ChartDataPoint {
  name: string;
  value: number;
  amount: number;
}

@Component({
  selector: 'app-custom-tooltip-example',
  imports: [
    SpnLineChart,
    SpnXAxis,
    SpnYAxis,
    SpnLine,
    SpnCartesianGrid,
    SpnLegend,
    SpnTooltip,
    SpnTooltipContentDef,
    CurrencyPipe,
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
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true">
        <ng-template spnTooltipContent let-state>
          <div class="custom-tooltip">
            <div class="tooltip-header">{{ state.label }}</div>
            <div class="tooltip-body">
              @for (item of state.payload; track item.dataKey) {
                <div class="tooltip-row">
                  <span class="tooltip-marker" [style.background]="item.color"></span>
                  <span class="tooltip-name">{{ item.name }}</span>
                  <span class="tooltip-value">{{ item.value | currency }}</span>
                </div>
              }
            </div>
            <div class="tooltip-footer">
              Total: {{ calculateTotal(state.payload) | currency }}
            </div>
          </div>
        </ng-template>
      </spn-tooltip>
    </spn-line-chart>
  `,
  styles: [
    `
      .custom-tooltip {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 12px;
        min-width: 160px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      }

      .tooltip-header {
        font-size: 14px;
        font-weight: 600;
        color: #f1f5f9;
        padding-bottom: 8px;
        border-bottom: 1px solid #334155;
        margin-bottom: 8px;
      }

      .tooltip-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .tooltip-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .tooltip-marker {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .tooltip-name {
        flex: 1;
        color: #94a3b8;
        font-size: 13px;
      }

      .tooltip-value {
        font-weight: 600;
        color: #f1f5f9;
        font-size: 13px;
      }

      .tooltip-footer {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #334155;
        font-weight: 600;
        color: #f1f5f9;
        text-align: right;
        font-size: 14px;
      }
    `,
  ],
})
export class CustomTooltipExampleComponent {
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

  calculateTotal(payload: TooltipPayload[]): number {
    return payload.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  }
}
