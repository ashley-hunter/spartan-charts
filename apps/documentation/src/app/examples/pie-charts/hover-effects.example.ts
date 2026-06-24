import { Component } from '@angular/core';
import { SpnPieChart, SpnPie, SpnTooltip, SpnLegend } from '@spartan-ng/charts';

interface PieDataPoint {
  name: string;
  value: number;
}

@Component({
  selector: 'app-hover-effects-pie-example',
  imports: [SpnPieChart, SpnPie, SpnTooltip, SpnLegend],
  template: `
    <spn-pie-chart [data]="chartData" width="500" height="400">
      <spn-pie
        dataKey="value"
        nameKey="name"
        innerRadius="40%"
        outerRadius="75%"
        [cornerRadius]="4"
        [paddingAngle]="2"
        [hoverExplodeOffset]="10"
        [dimOthers]="true"
        [dimOpacity]="0.4"
        [hoverTransitionDuration]="200"
      />
      <spn-tooltip separator=": " />
      <spn-legend layout="horizontal" align="center" />
    </spn-pie-chart>
  `,
  styles: [],
})
export class HoverEffectsPieExampleComponent {
  protected readonly chartData: PieDataPoint[] = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home & Garden', value: 200 },
    { name: 'Sports', value: 150 },
    { name: 'Books', value: 100 },
  ];
}
