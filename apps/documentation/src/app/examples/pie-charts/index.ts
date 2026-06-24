// Example components
export { BasicPieExampleComponent } from './basic-pie.example';
export { DonutChartExampleComponent } from './donut-chart.example';
export { NestedPieExampleComponent } from './nested-pie.example';
export { LabeledPieExampleComponent } from './labeled-pie.example';
export { PieTooltipExampleComponent } from './tooltip.example';
export { HoverEffectsPieExampleComponent } from './hover-effects.example';

// Source code as strings
export const BASIC_PIE_SOURCE = `import { Component } from '@angular/core';
import { SpnPieChart, SpnPie } from '@spartan-ng/charts';

@Component({
  selector: 'app-basic-pie-example',
  imports: [SpnPieChart, SpnPie],
  template: \`
    <spn-pie-chart [data]="chartData" width="400" height="400">
      <spn-pie dataKey="value" nameKey="name" />
    </spn-pie-chart>
  \`,
})
export class BasicPieExampleComponent {
  protected readonly chartData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home & Garden', value: 200 },
    { name: 'Sports', value: 150 },
    { name: 'Books', value: 100 },
  ];
}`;

export const DONUT_CHART_SOURCE = `import { Component } from '@angular/core';
import { SpnPieChart, SpnPie } from '@spartan-ng/charts';

@Component({
  selector: 'app-donut-chart-example',
  imports: [SpnPieChart, SpnPie],
  template: \`
    <spn-pie-chart [data]="chartData" width="400" height="400">
      <spn-pie
        dataKey="value"
        nameKey="name"
        innerRadius="60%"
        outerRadius="80%"
        [paddingAngle]="2"
      />
    </spn-pie-chart>
  \`,
})
export class DonutChartExampleComponent {
  protected readonly chartData = [
    { name: 'Chrome', value: 65 },
    { name: 'Safari', value: 19 },
    { name: 'Firefox', value: 8 },
    { name: 'Edge', value: 5 },
    { name: 'Other', value: 3 },
  ];
}`;

export const NESTED_PIE_SOURCE = `import { Component } from '@angular/core';
import { SpnPieChart, SpnPie } from '@spartan-ng/charts';

@Component({
  selector: 'app-nested-pie-example',
  imports: [SpnPieChart, SpnPie],
  template: \`
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
  \`,
})
export class NestedPieExampleComponent {
  // Inner ring - main categories
  protected readonly innerData = [
    { name: 'Tech', value: 450 },
    { name: 'Finance', value: 350 },
    { name: 'Healthcare', value: 200 },
  ];

  // Outer ring - subcategories
  protected readonly outerData = [
    { name: 'Software', value: 250 },
    { name: 'Hardware', value: 200 },
    { name: 'Banking', value: 200 },
    { name: 'Insurance', value: 150 },
    { name: 'Pharma', value: 120 },
    { name: 'Medical Devices', value: 80 },
  ];

  protected readonly innerColors = ['#8884d8', '#82ca9d', '#ffc658'];
  protected readonly outerColors = ['#8884d8', '#a4a0e8', '#82ca9d', '#a8dfc0', '#ffc658', '#ffd98a'];
}`;

export const LABELED_PIE_SOURCE = `import { Component } from '@angular/core';
import { SpnPieChart, SpnPie } from '@spartan-ng/charts';

@Component({
  selector: 'app-labeled-pie-example',
  imports: [SpnPieChart, SpnPie],
  template: \`
    <spn-pie-chart [data]="chartData" width="500" height="400">
      <spn-pie
        dataKey="value"
        nameKey="name"
        outerRadius="70%"
        [label]="labelConfig"
        [labelLine]="true"
      />
    </spn-pie-chart>
  \`,
})
export class LabeledPieExampleComponent {
  protected readonly chartData = [
    { name: 'Product A', value: 2400 },
    { name: 'Product B', value: 1398 },
    { name: 'Product C', value: 9800 },
    { name: 'Product D', value: 3908 },
    { name: 'Product E', value: 4800 },
  ];

  protected readonly labelConfig = {
    position: 'outside' as const,
    formatter: (value: number, name: string, percent: number) =>
      \`\${name}: \${percent.toFixed(0)}%\`,
    fontSize: 12,
  };
}`;

export const PIE_TOOLTIP_SOURCE = `import { Component } from '@angular/core';
import { SpnPieChart, SpnPie, SpnTooltip, SpnLegend } from '@spartan-ng/charts';

@Component({
  selector: 'app-pie-tooltip-example',
  imports: [SpnPieChart, SpnPie, SpnTooltip, SpnLegend],
  template: \`
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
  \`,
})
export class PieTooltipExampleComponent {
  protected readonly chartData = [
    { category: 'Housing', amount: 1500 },
    { category: 'Food', amount: 600 },
    { category: 'Transportation', amount: 400 },
    { category: 'Utilities', amount: 300 },
    { category: 'Entertainment', amount: 200 },
    { category: 'Other', amount: 250 },
  ];
}`;

export const HOVER_EFFECTS_PIE_SOURCE = `import { Component } from '@angular/core';
import { SpnPieChart, SpnPie, SpnTooltip, SpnLegend } from '@spartan-ng/charts';

@Component({
  selector: 'app-hover-effects-pie-example',
  imports: [SpnPieChart, SpnPie, SpnTooltip, SpnLegend],
  template: \`
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
  \`,
})
export class HoverEffectsPieExampleComponent {
  protected readonly chartData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home & Garden', value: 200 },
    { name: 'Sports', value: 150 },
    { name: 'Books', value: 100 },
  ];
}`;
