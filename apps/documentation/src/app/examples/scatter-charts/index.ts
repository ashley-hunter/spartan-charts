// Example components
export { BasicScatterChartExampleComponent } from './basic-scatter-chart.example';
export { GridScatterChartExampleComponent } from './grid-scatter-chart.example';
export { MultiSeriesExampleComponent } from './multi-series.example';
export { TooltipExampleComponent } from './tooltip.example';
export { ConnectedScatterExampleComponent } from './connected-scatter.example';
export { CustomSizesExampleComponent } from './custom-sizes.example';
export { ReferenceLinesExampleComponent } from './reference-lines.example';
export { LinearCurveExampleComponent } from './linear-curve.example';
export { MonotoneXCurveExampleComponent } from './monotone-x-curve.example';
export { NaturalCurveExampleComponent } from './natural-curve.example';
export { BasisCurveExampleComponent } from './basis-curve.example';

// Source code as strings
export const BASIC_SCATTER_CHART_SOURCE = `import { Component } from '@angular/core';
import {
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basic-scatter-chart-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter],
  template: \`
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter xDataKey="x" yDataKey="y" fill="#8884d8" />
    </spn-scatter-chart>
  \`,
})
export class BasicScatterChartExampleComponent {
  protected readonly chartData = [
    { x: 100, y: 200 },
    { x: 120, y: 100 },
    { x: 170, y: 300 },
    { x: 140, y: 250 },
    { x: 150, y: 400 },
    { x: 110, y: 280 },
    { x: 180, y: 320 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const GRID_SCATTER_CHART_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-grid-scatter-chart-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: \`
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter xDataKey="x" yDataKey="y" fill="#8884d8" />
    </spn-scatter-chart>
  \`,
})
export class GridScatterChartExampleComponent {
  protected readonly chartData = [
    { x: 100, y: 200 },
    { x: 120, y: 100 },
    { x: 170, y: 300 },
    { x: 140, y: 250 },
    { x: 150, y: 400 },
    { x: 110, y: 280 },
    { x: 180, y: 320 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const MULTI_SERIES_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-multi-series-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid, SpnLegend],
  template: \`
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="groupA" orientation="left" type="number" />
      <spn-scatter xDataKey="x" yDataKey="groupA" name="Group A" fill="#8884d8" />
      <spn-scatter xDataKey="x" yDataKey="groupB" name="Group B" fill="#82ca9d" />
      <spn-legend align="center" verticalAlign="top" />
    </spn-scatter-chart>
  \`,
})
export class MultiSeriesExampleComponent {
  protected readonly chartData = [
    { x: 100, groupA: 200, groupB: 150 },
    { x: 120, groupA: 100, groupB: 230 },
    { x: 170, groupA: 300, groupB: 180 },
    { x: 140, groupA: 250, groupB: 290 },
    { x: 150, groupA: 400, groupB: 350 },
    { x: 110, groupA: 280, groupB: 200 },
    { x: 180, groupA: 320, groupB: 270 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const TOOLTIP_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnLegend,
  SpnScatterChart,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-tooltip-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: \`
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        name="Data Points"
        fill="#8884d8"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true" separator=" : " />
    </spn-scatter-chart>
  \`,
})
export class TooltipExampleComponent {
  protected readonly chartData = [
    { x: 100, y: 200 },
    { x: 120, y: 100 },
    { x: 170, y: 300 },
    { x: 140, y: 250 },
    { x: 150, y: 400 },
    { x: 110, y: 280 },
    { x: 180, y: 320 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const CONNECTED_SCATTER_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-connected-scatter-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: \`
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        fill="#8884d8"
        [line]="true"
        lineStrokeWidth="2"
        lineCurve="monotoneX"
      />
    </spn-scatter-chart>
  \`,
})
export class ConnectedScatterExampleComponent {
  protected readonly chartData = [
    { x: 10, y: 30 },
    { x: 30, y: 80 },
    { x: 45, y: 50 },
    { x: 60, y: 120 },
    { x: 80, y: 90 },
    { x: 100, y: 150 },
    { x: 120, y: 180 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const CUSTOM_SIZES_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-custom-sizes-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: \`
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        name="Small"
        fill="#3b82f6"
        [size]="40"
        stroke="#1d4ed8"
        [strokeWidth]="2"
      />
      <spn-scatter
        [data]="chartData2"
        xDataKey="x"
        yDataKey="y"
        name="Medium"
        fill="#10b981"
        [size]="100"
        [opacity]="0.8"
      />
      <spn-scatter
        [data]="chartData3"
        xDataKey="x"
        yDataKey="y"
        name="Large"
        fill="#f59e0b"
        [size]="200"
        [opacity]="0.6"
        stroke="#d97706"
        [strokeWidth]="2"
      />
    </spn-scatter-chart>
  \`,
})
export class CustomSizesExampleComponent {
  protected readonly chartData = [
    { x: 50, y: 100 },
    { x: 80, y: 150 },
    { x: 110, y: 80 },
  ];

  protected readonly chartData2 = [
    { x: 70, y: 200 },
    { x: 130, y: 250 },
    { x: 160, y: 180 },
  ];

  protected readonly chartData3 = [
    { x: 100, y: 350 },
    { x: 150, y: 300 },
    { x: 180, y: 400 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const REFERENCE_LINES_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnScatterChart,
  SpnReferenceLine,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-reference-lines-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid, SpnReferenceLine],
  template: \`
    <spn-scatter-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-reference-line
        [y]="300"
        stroke="#ef4444"
        strokeDasharray="5 5"
        label="Threshold"
      />
      <spn-reference-line
        [x]="150"
        stroke="#8b5cf6"
        strokeDasharray="3 3"
        label="Midpoint"
      />
      <spn-scatter xDataKey="x" yDataKey="y" fill="#8884d8" />
    </spn-scatter-chart>
  \`,
})
export class ReferenceLinesExampleComponent {
  protected readonly chartData = [
    { x: 100, y: 200 },
    { x: 120, y: 100 },
    { x: 170, y: 300 },
    { x: 140, y: 250 },
    { x: 150, y: 400 },
    { x: 110, y: 280 },
    { x: 180, y: 320 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const LINEAR_CURVE_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-linear-curve-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: \`
    <spn-scatter-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        fill="#3b82f6"
        [line]="true"
        lineStrokeWidth="2"
        lineCurve="linear"
      />
    </spn-scatter-chart>
  \`,
})
export class LinearCurveExampleComponent {
  protected readonly chartData = [
    { x: 10, y: 30 },
    { x: 30, y: 80 },
    { x: 45, y: 50 },
    { x: 60, y: 120 },
    { x: 80, y: 90 },
    { x: 100, y: 150 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const MONOTONEX_CURVE_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-monotonex-curve-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: \`
    <spn-scatter-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        fill="#3b82f6"
        [line]="true"
        lineStrokeWidth="2"
        lineCurve="monotoneX"
      />
    </spn-scatter-chart>
  \`,
})
export class MonotoneXCurveExampleComponent {
  protected readonly chartData = [
    { x: 10, y: 30 },
    { x: 30, y: 80 },
    { x: 45, y: 50 },
    { x: 60, y: 120 },
    { x: 80, y: 90 },
    { x: 100, y: 150 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const NATURAL_CURVE_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-natural-curve-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: \`
    <spn-scatter-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        fill="#3b82f6"
        [line]="true"
        lineStrokeWidth="2"
        lineCurve="natural"
      />
    </spn-scatter-chart>
  \`,
})
export class NaturalCurveExampleComponent {
  protected readonly chartData = [
    { x: 10, y: 30 },
    { x: 30, y: 80 },
    { x: 45, y: 50 },
    { x: 60, y: 120 },
    { x: 80, y: 90 },
    { x: 100, y: 150 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const BASIS_CURVE_SOURCE = `import { Component } from '@angular/core';
import {
  SpnCartesianGrid,
  SpnScatterChart,
  SpnXAxis,
  SpnYAxis,
  SpnScatter,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basis-curve-example',
  imports: [SpnScatterChart, SpnXAxis, SpnYAxis, SpnScatter, SpnCartesianGrid],
  template: \`
    <spn-scatter-chart [data]="chartData" width="400" height="300" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="x" orientation="bottom" type="number" />
      <spn-y-axis dataKey="y" orientation="left" type="number" />
      <spn-scatter
        xDataKey="x"
        yDataKey="y"
        fill="#3b82f6"
        [line]="true"
        lineStrokeWidth="2"
        lineCurve="basis"
      />
    </spn-scatter-chart>
  \`,
})
export class BasisCurveExampleComponent {
  protected readonly chartData = [
    { x: 10, y: 30 },
    { x: 30, y: 80 },
    { x: 45, y: 50 },
    { x: 60, y: 120 },
    { x: 80, y: 90 },
    { x: 100, y: 150 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;
