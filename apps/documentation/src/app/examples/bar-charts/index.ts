// Example components
export { BasicBarChartExampleComponent } from './basic-bar-chart.example';
export { GroupedBarsExampleComponent } from './grouped-bars.example';
export { StackedBarsExampleComponent } from './stacked-bars.example';
export { HorizontalBarsExampleComponent } from './horizontal-bars.example';
export { StyledBarsExampleComponent } from './styled-bars.example';
export { BarWithTooltipExampleComponent } from './with-tooltip.example';
export { HoverEffectsExampleComponent } from './hover-effects.example';
export { StackedHoverEffectsExampleComponent } from './stacked-hover-effects.example';

// Source code as strings
export const BASIC_BAR_CHART_SOURCE = `import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basic-bar-chart-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar],
  template: \`
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar dataKey="value" fill="#3b82f6" />
    </spn-bar-chart>
  \`,
})
export class BasicBarChartExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
    { name: 'Jul', value: 349 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const GROUPED_BARS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-grouped-bars-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnLegend],
  template: \`
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
      <spn-bar dataKey="profit" name="Profit" fill="#10b981" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-bar-chart>
  \`,
})
export class GroupedBarsExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', revenue: 400, profit: 240 },
    { name: 'Feb', revenue: 300, profit: 139 },
    { name: 'Mar', revenue: 200, profit: 180 },
    { name: 'Apr', revenue: 278, profit: 190 },
    { name: 'May', revenue: 189, profit: 120 },
    { name: 'Jun', revenue: 239, profit: 180 },
    { name: 'Jul', revenue: 349, profit: 230 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const STACKED_BARS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-stacked-bars-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnLegend],
  template: \`
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar dataKey="revenue" name="Revenue" fill="#3b82f6" stackId="stack1" />
      <spn-bar dataKey="profit" name="Profit" fill="#10b981" stackId="stack1" />
      <spn-bar dataKey="expenses" name="Expenses" fill="#f59e0b" stackId="stack1" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-bar-chart>
  \`,
})
export class StackedBarsExampleComponent {
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
}`;

export const HORIZONTAL_BARS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-horizontal-bars-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid],
  template: \`
    <spn-bar-chart
      [data]="chartData"
      width="700"
      height="400"
      [margin]="margin"
      layout="horizontal"
    >
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis type="number" orientation="bottom" />
      <spn-y-axis dataKey="name" orientation="left" type="category" />
      <spn-bar dataKey="value" fill="#8b5cf6" />
    </spn-bar-chart>
  \`,
})
export class HorizontalBarsExampleComponent {
  protected readonly chartData = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 200 },
    { name: 'Product D', value: 278 },
    { name: 'Product E', value: 189 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 80 };
}`;

export const STYLED_BARS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-styled-bars-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid],
  template: \`
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar
        dataKey="value"
        fill="#ec4899"
        stroke="#be185d"
        strokeWidth="2"
        [radius]="[8, 8, 0, 0]"
      />
    </spn-bar-chart>
  \`,
})
export class StyledBarsExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
    { name: 'Jul', value: 349 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const BAR_WITH_TOOLTIP_SOURCE = `import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-bar-with-tooltip-example',
  
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: \`
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
      <spn-bar dataKey="profit" name="Profit" fill="#10b981" />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true" separator=" : " />
    </spn-bar-chart>
  \`,
})
export class BarWithTooltipExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', revenue: 400, profit: 240 },
    { name: 'Feb', revenue: 300, profit: 139 },
    { name: 'Mar', revenue: 200, profit: 180 },
    { name: 'Apr', revenue: 278, profit: 190 },
    { name: 'May', revenue: 189, profit: 120 },
    { name: 'Jun', revenue: 239, profit: 180 },
    { name: 'Jul', revenue: 349, profit: 230 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const HOVER_EFFECTS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
  SpnTooltip,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-hover-effects-example',
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnTooltip],
  template: \`
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar
        dataKey="value"
        fill="#3b82f6"
        hoverFill="#60a5fa"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
        [radius]="[4, 4, 0, 0]"
      />
      <spn-tooltip />
    </spn-bar-chart>
  \`,
})
export class HoverEffectsExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
    { name: 'Jul', value: 349 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const STACKED_HOVER_EFFECTS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnBarChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnXAxis,
  SpnYAxis,
  SpnBar,
  SpnTooltip,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-stacked-hover-effects-example',
  imports: [SpnBarChart, SpnXAxis, SpnYAxis, SpnBar, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: \`
    <spn-bar-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-bar
        dataKey="revenue"
        name="Revenue"
        fill="#3b82f6"
        hoverFill="#60a5fa"
        stackId="stack1"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
      />
      <spn-bar
        dataKey="profit"
        name="Profit"
        fill="#10b981"
        hoverFill="#34d399"
        stackId="stack1"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
      />
      <spn-bar
        dataKey="expenses"
        name="Expenses"
        fill="#f59e0b"
        hoverFill="#fbbf24"
        stackId="stack1"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
        [radius]="[4, 4, 0, 0]"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip />
    </spn-bar-chart>
  \`,
})
export class StackedHoverEffectsExampleComponent {
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
}`;
