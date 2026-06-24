// Example components
export { BasicLineChartExampleComponent } from './basic-line-chart.example';
export { GridLineChartExampleComponent } from './grid-line-chart.example';
export { MultiSeriesExampleComponent } from './multi-series.example';
export { TooltipExampleComponent } from './tooltip.example';
export { DotsExampleComponent } from './dots.example';
export { LinearCurveExampleComponent } from './linear-curve.example';
export { MonotoneXCurveExampleComponent } from './monotone-x-curve.example';
export { BasisCurveExampleComponent } from './basis-curve.example';
export { StepCurveExampleComponent } from './step-curve.example';
export { ReferenceLinesExampleComponent } from './reference-lines.example';
export { LineHoverEffectsExampleComponent } from './hover-effects.example';

// Source code as strings
export const BASIC_LINE_CHART_SOURCE = `import { Component } from '@angular/core';
import {
  SpnLineChart,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basic-line-chart-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" />
    </spn-line-chart>
  \`,
})
export class BasicLineChartExampleComponent {
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

export const GRID_LINE_CHART_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLineChart,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-grid-line-chart-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" />
    </spn-line-chart>
  \`,
})
export class GridLineChartExampleComponent {
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

export const MULTI_SERIES_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnLineChart,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-multi-series-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnLegend],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" name="Revenue" stroke="#3b82f6" strokeWidth="2" />
      <spn-line dataKey="amount" name="Profit" stroke="#10b981" strokeWidth="2" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-line-chart>
  \`,
})
export class MultiSeriesExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400, amount: 240 },
    { name: 'Feb', value: 300, amount: 139 },
    { name: 'Mar', value: 200, amount: 380 },
    { name: 'Apr', value: 278, amount: 390 },
    { name: 'May', value: 189, amount: 480 },
    { name: 'Jun', value: 239, amount: 380 },
    { name: 'Jul', value: 349, amount: 430 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const TOOLTIP_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnLineChart,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-tooltip-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line
        dataKey="value"
        name="Revenue"
        stroke="#3b82f6"
        strokeWidth="2"
        curve="monotoneX"
      />
      <spn-line
        dataKey="amount"
        name="Profit"
        stroke="#10b981"
        strokeWidth="2"
        curve="monotoneX"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true" separator=" : " />
    </spn-line-chart>
  \`,
})
export class TooltipExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400, amount: 240 },
    { name: 'Feb', value: 300, amount: 139 },
    { name: 'Mar', value: 200, amount: 380 },
    { name: 'Apr', value: 278, amount: 390 },
    { name: 'May', value: 189, amount: 480 },
    { name: 'Jun', value: 239, amount: 380 },
    { name: 'Jul', value: 349, amount: 430 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const DOTS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnLineChart,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-dots-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line
        dataKey="value"
        name="Revenue"
        stroke="#3b82f6"
        strokeWidth="2"
        [dot]="true"
        dotSize="4"
        dotFill="#3b82f6"
        dotStroke="#fff"
        dotStrokeWidth="2"
        [activeDot]="true"
        activeDotSize="8"
      />
      <spn-line
        dataKey="amount"
        name="Profit"
        stroke="#10b981"
        strokeWidth="2"
        [dot]="true"
        dotSize="4"
        dotFill="#10b981"
        dotStroke="#fff"
        dotStrokeWidth="2"
        [activeDot]="true"
        activeDotSize="8"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip offset="10" />
    </spn-line-chart>
  \`,
})
export class DotsExampleComponent {
  protected readonly chartData = [
    { name: 'Jan', value: 400, amount: 240 },
    { name: 'Feb', value: 300, amount: 139 },
    { name: 'Mar', value: 200, amount: 380 },
    { name: 'Apr', value: 278, amount: 390 },
    { name: 'May', value: 189, amount: 480 },
    { name: 'Jun', value: 239, amount: 380 },
    { name: 'Jul', value: 349, amount: 430 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const LINEAR_CURVE_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLineChart,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-linear-curve-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid],
  template: \`
    <spn-line-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" curve="linear" />
    </spn-line-chart>
  \`,
})
export class LinearCurveExampleComponent {
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

export const MONOTONEX_CURVE_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLineChart,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-monotone-x-curve-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid],
  template: \`
    <spn-line-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" curve="monotoneX" />
    </spn-line-chart>
  \`,
})
export class MonotoneXCurveExampleComponent {
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

export const BASIS_CURVE_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLineChart,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basis-curve-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid],
  template: \`
    <spn-line-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" curve="basis" />
    </spn-line-chart>
  \`,
})
export class BasisCurveExampleComponent {
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

export const STEP_CURVE_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLineChart,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-step-curve-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid],
  template: \`
    <spn-line-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" curve="step" />
    </spn-line-chart>
  \`,
})
export class StepCurveExampleComponent {
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

export const REFERENCE_LINES_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLineChart,
  SpnReferenceLine,
  SpnXAxis,
  SpnYAxis,
  SpnLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-reference-lines-example',
  
  imports: [SpnLineChart, SpnXAxis, SpnYAxis, SpnLine, SpnCartesianGrid, SpnReferenceLine],
  template: \`
    <spn-line-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="name" orientation="bottom" />
      <spn-y-axis dataKey="value" orientation="left" />
      <spn-reference-line
        [y]="350"
        stroke="#ef4444"
        strokeDasharray="5 5"
        label="Target"
      />
      <spn-reference-line
        x="Apr"
        stroke="#8b5cf6"
        strokeDasharray="3 3"
        label="Q2"
      />
      <spn-line dataKey="value" stroke="#3b82f6" strokeWidth="2" />
    </spn-line-chart>
  \`,
})
export class ReferenceLinesExampleComponent {
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
  protected readonly targetValue = 350;
}`;

export const HOVER_EFFECTS_SOURCE = `import { Component } from '@angular/core';
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
  template: \`
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
  \`,
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
}`;
