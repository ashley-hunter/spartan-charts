// Example components
export { BasicAreaChartExampleComponent } from './basic-area-chart.example';
export { StackedAreaChartExampleComponent } from './stacked-area-chart.example';
export { MultiSeriesAreaExampleComponent } from './multi-series-area.example';
export { AreaWithDotsExampleComponent } from './area-with-dots.example';
export { AreaWithTooltipExampleComponent } from './with-tooltip.example';

// Source code as strings
export const BASIC_AREA_CHART_SOURCE = `import { Component } from '@angular/core';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basic-area-chart-example',

  imports: [SpnAreaChart, SpnXAxis, SpnYAxis, SpnArea, SpnCartesianGrid],
  template: \`
    <spn-area-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-area dataKey="value" fill="#3b82f6" stroke="#3b82f6" fillOpacity="0.4" />
    </spn-area-chart>
  \`,
})
export class BasicAreaChartExampleComponent {
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

export const STACKED_AREA_CHART_SOURCE = `import { Component } from '@angular/core';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
  SpnLegend,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-stacked-area-chart-example',

  imports: [SpnAreaChart, SpnXAxis, SpnYAxis, SpnArea, SpnCartesianGrid, SpnLegend],
  template: \`
    <spn-area-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-area dataKey="revenue" name="Revenue" fill="#3b82f6" stroke="#3b82f6" stackId="stack1" fillOpacity="0.6" />
      <spn-area dataKey="profit" name="Profit" fill="#10b981" stroke="#10b981" stackId="stack1" fillOpacity="0.6" />
      <spn-area dataKey="expenses" name="Expenses" fill="#f59e0b" stroke="#f59e0b" stackId="stack1" fillOpacity="0.6" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-area-chart>
  \`,
})
export class StackedAreaChartExampleComponent {
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

export const MULTI_SERIES_AREA_SOURCE = `import { Component } from '@angular/core';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
  SpnLegend,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-multi-series-area-example',

  imports: [SpnAreaChart, SpnXAxis, SpnYAxis, SpnArea, SpnCartesianGrid, SpnLegend],
  template: \`
    <spn-area-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-area dataKey="series1" name="Series A" fill="#3b82f6" stroke="#3b82f6" fillOpacity="0.3" />
      <spn-area dataKey="series2" name="Series B" fill="#10b981" stroke="#10b981" fillOpacity="0.3" />
      <spn-area dataKey="series3" name="Series C" fill="#f59e0b" stroke="#f59e0b" fillOpacity="0.3" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-area-chart>
  \`,
})
export class MultiSeriesAreaExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', series1: 400, series2: 240, series3: 180 },
    { name: 'Feb', series1: 300, series2: 339, series3: 220 },
    { name: 'Mar', series1: 200, series2: 280, series3: 150 },
    { name: 'Apr', series1: 278, series2: 190, series3: 310 },
    { name: 'May', series1: 189, series2: 320, series3: 250 },
    { name: 'Jun', series1: 239, series2: 180, series3: 280 },
    { name: 'Jul', series1: 349, series2: 230, series3: 200 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const AREA_WITH_DOTS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
  SpnTooltip,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-area-with-dots-example',

  imports: [SpnAreaChart, SpnXAxis, SpnYAxis, SpnArea, SpnCartesianGrid, SpnTooltip],
  template: \`
    <spn-area-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-area
        dataKey="value"
        fill="#3b82f6"
        stroke="#3b82f6"
        fillOpacity="0.4"
        dot
        activeDot
      />
      <spn-tooltip cursor separator=" : " />
    </spn-area-chart>
  \`,
})
export class AreaWithDotsExampleComponent {
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

export const AREA_WITH_TOOLTIP_SOURCE = `import { Component } from '@angular/core';
import {
  SpnAreaChart,
  SpnXAxis,
  SpnYAxis,
  SpnArea,
  SpnCartesianGrid,
  SpnLegend,
  SpnTooltip,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-area-with-tooltip-example',

  imports: [SpnAreaChart, SpnXAxis, SpnYAxis, SpnArea, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: \`
    <spn-area-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis orientation="left" />
      <spn-area dataKey="revenue" name="Revenue" fill="#3b82f6" stroke="#3b82f6" fillOpacity="0.4" />
      <spn-area dataKey="profit" name="Profit" fill="#10b981" stroke="#10b981" fillOpacity="0.4" />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true" separator=" : " />
    </spn-area-chart>
  \`,
})
export class AreaWithTooltipExampleComponent {
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
