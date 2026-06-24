import { Component } from '@angular/core';
import {
  SpnLineChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
  SpnTooltip,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-line-hover-effects-example',
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: `
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-line
        dataKey="revenue"
        name="Revenue"
        stroke="#3b82f6"
        hoverStroke="#60a5fa"
        [hoverStrokeWidth]="4"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
        [dot]="true"
        [activeDot]="true"
      />
      <spn-line
        dataKey="profit"
        name="Profit"
        stroke="#10b981"
        hoverStroke="#34d399"
        [hoverStrokeWidth]="4"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
        [dot]="true"
        [activeDot]="true"
      />
      <spn-line
        dataKey="expenses"
        name="Expenses"
        stroke="#f59e0b"
        hoverStroke="#fbbf24"
        [hoverStrokeWidth]="4"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
        [dot]="true"
        [activeDot]="true"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip />
    </spn-line-chart>
  `,
})
export class LineHoverEffectsExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', revenue: 400, profit: 240, expenses: 100 },
    { name: 'Feb', revenue: 300, profit: 139, expenses: 80 },
    { name: 'Mar', revenue: 200, profit: 180, expenses: 120 },
    { name: 'Apr', revenue: 278, profit: 190, expenses: 90 },
    { name: 'May', revenue: 189, profit: 120, expenses: 70 },
    { name: 'Jun', revenue: 239, profit: 180, expenses: 110 },
    { name: 'Jul', revenue: 349, profit: 230, expenses: 130 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}
