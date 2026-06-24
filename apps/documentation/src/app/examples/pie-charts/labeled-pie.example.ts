import { Component } from '@angular/core';
import { SpnPieChart, SpnPie } from '@spartan-ng/charts';

interface RevenueData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-labeled-pie-example',
  imports: [SpnPieChart, SpnPie],
  template: `
    <spn-pie-chart [data]="chartData" width="500" height="400">
      <spn-pie
        dataKey="value"
        nameKey="name"
        outerRadius="70%"
        [label]="labelConfig"
        [labelLine]="true"
      />
    </spn-pie-chart>
  `,
  styles: [],
})
export class LabeledPieExampleComponent {
  protected readonly chartData: RevenueData[] = [
    { name: 'Product A', value: 2400 },
    { name: 'Product B', value: 1398 },
    { name: 'Product C', value: 9800 },
    { name: 'Product D', value: 3908 },
    { name: 'Product E', value: 4800 },
  ];

  protected readonly labelConfig = {
    position: 'outside' as const,
    formatter: (value: number, name: string, percent: number) =>
      `${name}: ${percent.toFixed(0)}%`,
    fontSize: 12,
  };
}
