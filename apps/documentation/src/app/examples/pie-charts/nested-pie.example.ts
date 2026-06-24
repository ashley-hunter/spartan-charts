import { Component } from '@angular/core';
import { SpnPieChart, SpnPie } from '@spartan-ng/charts';

interface CategoryData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-nested-pie-example',
  imports: [SpnPieChart, SpnPie],
  template: `
    <spn-pie-chart [data]="[]" width="500" height="500">
      <!-- Inner ring: Categories -->
      <spn-pie
        [data]="innerData"
        dataKey="value"
        nameKey="name"
        innerRadius="0"
        outerRadius="35%"
        [colors]="innerColors"
      />
      <!-- Outer ring: Subcategories -->
      <spn-pie
        [data]="outerData"
        dataKey="value"
        nameKey="name"
        innerRadius="40%"
        outerRadius="70%"
        [colors]="outerColors"
      />
    </spn-pie-chart>
  `,
  styles: [],
})
export class NestedPieExampleComponent {
  // Inner ring - main categories
  protected readonly innerData: CategoryData[] = [
    { name: 'Tech', value: 450 },
    { name: 'Finance', value: 350 },
    { name: 'Healthcare', value: 200 },
  ];

  // Outer ring - subcategories
  protected readonly outerData: CategoryData[] = [
    { name: 'Software', value: 250 },
    { name: 'Hardware', value: 200 },
    { name: 'Banking', value: 200 },
    { name: 'Insurance', value: 150 },
    { name: 'Pharma', value: 120 },
    { name: 'Medical Devices', value: 80 },
  ];

  protected readonly innerColors = ['#8884d8', '#82ca9d', '#ffc658'];
  protected readonly outerColors = ['#8884d8', '#a4a0e8', '#82ca9d', '#a8dfc0', '#ffc658', '#ffd98a'];
}
