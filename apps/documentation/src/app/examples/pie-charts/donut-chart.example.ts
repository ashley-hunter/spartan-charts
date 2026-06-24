import { Component } from '@angular/core';
import { SpnPieChart, SpnPie } from '@spartan-ng/charts';

interface MarketShare {
  name: string;
  value: number;
}

@Component({
  selector: 'app-donut-chart-example',
  imports: [SpnPieChart, SpnPie],
  template: `
    <spn-pie-chart [data]="chartData" width="400" height="400">
      <spn-pie
        dataKey="value"
        nameKey="name"
        innerRadius="60%"
        outerRadius="80%"
        [paddingAngle]="2"
      />
    </spn-pie-chart>
  `,
  styles: [],
})
export class DonutChartExampleComponent {
  protected readonly chartData: MarketShare[] = [
    { name: 'Chrome', value: 65 },
    { name: 'Safari', value: 19 },
    { name: 'Firefox', value: 8 },
    { name: 'Edge', value: 5 },
    { name: 'Other', value: 3 },
  ];
}
