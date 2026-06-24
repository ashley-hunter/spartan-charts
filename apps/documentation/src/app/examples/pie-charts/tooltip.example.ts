import { Component } from '@angular/core';
import { SpnPieChart, SpnPie, SpnTooltip, SpnLegend } from '@spartan-ng/charts';

interface ExpenseData {
  category: string;
  amount: number;
}

@Component({
  selector: 'app-pie-tooltip-example',
  imports: [SpnPieChart, SpnPie, SpnTooltip, SpnLegend],
  template: `
    <spn-pie-chart [data]="chartData" width="500" height="400">
      <spn-pie
        dataKey="amount"
        nameKey="category"
        innerRadius="40%"
        outerRadius="75%"
        [cornerRadius]="4"
        [paddingAngle]="2"
      />
      <spn-tooltip separator=": $" />
      <spn-legend layout="horizontal" align="center" />
    </spn-pie-chart>
  `,
  styles: [],
})
export class PieTooltipExampleComponent {
  protected readonly chartData: ExpenseData[] = [
    { category: 'Housing', amount: 1500 },
    { category: 'Food', amount: 600 },
    { category: 'Transportation', amount: 400 },
    { category: 'Utilities', amount: 300 },
    { category: 'Entertainment', amount: 200 },
    { category: 'Other', amount: 250 },
  ];
}
