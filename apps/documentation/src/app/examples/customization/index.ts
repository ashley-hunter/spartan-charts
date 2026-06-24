// Example components
export { CustomLegendExampleComponent } from './custom-legend.example';
export { CustomLegendIconExampleComponent } from './custom-legend-icon.example';
export { CustomTooltipExampleComponent } from './custom-tooltip.example';
export { CustomHeatmapLegendExampleComponent } from './custom-heatmap-legend.example';

// Source code as strings
export const CUSTOM_LEGEND_SOURCE = `import { Component } from '@angular/core';
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

@Component({
  selector: 'app-custom-legend-example',
  imports: [
    SpnLineChart, SpnXAxis, SpnYAxis, SpnLine,
    SpnCartesianGrid, SpnLegend, SpnLegendItemDef, SpnTooltip,
  ],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" name="Revenue" stroke="#3b82f6" strokeWidth="2" curve="monotoneX" />
      <spn-line dataKey="amount" name="Profit" stroke="#10b981" strokeWidth="2" curve="monotoneX" />
      <spn-legend align="center" verticalAlign="top">
        <ng-template spnLegendItem let-item let-onClick="onClick">
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
  \`,
  styles: [\`
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
    }
    .legend-pill.inactive { opacity: 0.4; }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  \`],
})
export class CustomLegendExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400, amount: 240 },
    { name: 'Feb', value: 300, amount: 139 },
    { name: 'Mar', value: 200, amount: 380 },
    { name: 'Apr', value: 278, amount: 390 },
    { name: 'May', value: 189, amount: 480 },
    { name: 'Jun', value: 239, amount: 380 },
    { name: 'Jul', value: 349, amount: 430 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const CUSTOM_LEGEND_ICON_SOURCE = `import { Component } from '@angular/core';
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

@Component({
  selector: 'app-custom-legend-icon-example',
  imports: [
    SpnLineChart, SpnXAxis, SpnYAxis, SpnLine,
    SpnCartesianGrid, SpnLegend, SpnLegendIconDef, SpnTooltip,
  ],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" name="Revenue" stroke="#3b82f6" strokeWidth="2" curve="monotoneX" />
      <spn-line dataKey="amount" name="Profit" stroke="#10b981" strokeWidth="2" curve="monotoneX" />
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
  \`,
})
export class CustomLegendIconExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400, amount: 240 },
    { name: 'Feb', value: 300, amount: 139 },
    { name: 'Mar', value: 200, amount: 380 },
    { name: 'Apr', value: 278, amount: 390 },
    { name: 'May', value: 189, amount: 480 },
    { name: 'Jun', value: 239, amount: 380 },
    { name: 'Jul', value: 349, amount: 430 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const CUSTOM_TOOLTIP_SOURCE = `import { Component } from '@angular/core';
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

@Component({
  selector: 'app-custom-tooltip-example',
  imports: [
    SpnLineChart, SpnXAxis, SpnYAxis, SpnLine,
    SpnCartesianGrid, SpnLegend, SpnTooltip, SpnTooltipContentDef, CurrencyPipe,
  ],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" name="Revenue" stroke="#3b82f6" strokeWidth="2" curve="monotoneX" />
      <spn-line dataKey="amount" name="Profit" stroke="#10b981" strokeWidth="2" curve="monotoneX" />
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
  \`,
  styles: [\`
    .custom-tooltip {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px;
      min-width: 160px;
    }
    .tooltip-header {
      font-size: 14px;
      font-weight: 600;
      color: #f1f5f9;
      padding-bottom: 8px;
      border-bottom: 1px solid #334155;
      margin-bottom: 8px;
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
    }
  \`],
})
export class CustomTooltipExampleComponent {
  protected readonly chartData = [
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
}`;

export const CUSTOM_HEATMAP_LEGEND_SOURCE = `import { Component } from '@angular/core';
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

@Component({
  selector: 'app-custom-heatmap-legend-example',
  imports: [
    SpnHeatmapChart, SpnHeatmap, SpnHeatmapLegend,
    SpnHeatmapLegendTickDef, SpnXAxis, SpnYAxis, SpnTooltip, DecimalPipe,
  ],
  template: \`
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
  \`,
  styles: [\`
    .custom-tick {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      padding: 2px 6px;
      background: rgba(100, 116, 139, 0.1);
      border-radius: 4px;
    }
  \`],
})
export class CustomHeatmapLegendExampleComponent {
  protected readonly chartData = this.generateHeatmapData();
  protected readonly margin = { top: 20, right: 80, bottom: 40, left: 80 };

  private generateHeatmapData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [];
    for (const day of days) {
      for (let hour = 0; hour < 24; hour++) {
        data.push({ day, hour, value: Math.round(Math.random() * 100) });
      }
    }
    return data;
  }
}`;
