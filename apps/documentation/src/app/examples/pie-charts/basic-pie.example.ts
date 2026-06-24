import { Component } from '@angular/core';
import { SpnPieChart, SpnPie } from '@spartan-ng/charts';

interface SalesData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-basic-pie-example',
  imports: [SpnPieChart, SpnPie],
  template: `
    <spn-pie-chart [data]="chartData" width="400" height="400">
      <spn-pie dataKey="value" nameKey="name" />
    </spn-pie-chart>
  `,
  styles: [],
})
export class BasicPieExampleComponent {
  protected readonly chartData: SalesData[] = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home & Garden', value: 200 },
    { name: 'Sports', value: 150 },
    { name: 'Books', value: 100 },
  ];
}
