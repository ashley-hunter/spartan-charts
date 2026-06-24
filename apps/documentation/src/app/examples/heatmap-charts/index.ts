// Example components
export { BasicHeatmapExampleComponent } from './basic-heatmap.example';
export { CustomColorsHeatmapExampleComponent } from './custom-colors.example';
export { TooltipHeatmapExampleComponent } from './tooltip.example';
export { CorrelationMatrixExampleComponent } from './correlation-matrix.example';
export { WithLabelsHeatmapExampleComponent } from './with-labels.example';
export { HoverEffectsHeatmapExampleComponent } from './hover-effects.example';

// Source code as strings
export const BASIC_HEATMAP_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basic-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap],
  template: \`
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" />
      <spn-heatmap
        xDataKey="hour"
        yDataKey="day"
        valueDataKey="value"
        colorScheme="blues"
      />
    </spn-heatmap-chart>
  \`,
})
export class BasicHeatmapExampleComponent {
  protected readonly chartData = this.generateData();
  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 60 };

  private generateData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
    const data = [];

    days.forEach((day) => {
      hours.forEach((hour) => {
        data.push({
          day,
          hour,
          value: Math.floor(Math.random() * 100),
        });
      });
    });

    return data;
  }
}`;

export const CUSTOM_COLORS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-custom-colors-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap],
  template: \`
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="month" orientation="bottom" />
      <spn-y-axis dataKey="category" orientation="left" />
      <spn-heatmap
        xDataKey="month"
        yDataKey="category"
        valueDataKey="value"
        colorScheme="viridis"
        [cellPadding]="2"
        [cellRadius]="4"
      />
    </spn-heatmap-chart>
  \`,
})
export class CustomColorsHeatmapExampleComponent {
  protected readonly chartData = [
    { month: 'Jan', category: 'Product A', value: 45 },
    { month: 'Jan', category: 'Product B', value: 78 },
    { month: 'Jan', category: 'Product C', value: 32 },
    { month: 'Feb', category: 'Product A', value: 62 },
    { month: 'Feb', category: 'Product B', value: 85 },
    { month: 'Feb', category: 'Product C', value: 41 },
    // ... more data
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 80 };
}`;

export const TOOLTIP_HEATMAP_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
  SpnTooltip,
  SpnCartesianGrid,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-tooltip-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap, SpnTooltip, SpnCartesianGrid],
  template: \`
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" />
      <spn-heatmap
        xDataKey="hour"
        yDataKey="day"
        valueDataKey="value"
        name="Activity"
        colorScheme="plasma"
        [cellPadding]="1"
      />
      <spn-tooltip separator=": " />
    </spn-heatmap-chart>
  \`,
})
export class TooltipHeatmapExampleComponent {
  protected readonly chartData = this.generateData();
  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 60 };

  private generateData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
    const data = [];

    days.forEach((day) => {
      hours.forEach((hour) => {
        const baseValue = ['10am', '11am', '2pm', '3pm'].includes(hour) ? 60 : 30;
        data.push({ day, hour, value: baseValue + Math.floor(Math.random() * 40) });
      });
    });

    return data;
  }
}`;

export const CORRELATION_MATRIX_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
  SpnTooltip,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-correlation-matrix-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap, SpnTooltip],
  template: \`
    <spn-heatmap-chart [data]="chartData" width="500" height="500" [margin]="margin">
      <spn-x-axis dataKey="var2" orientation="bottom" />
      <spn-y-axis dataKey="var1" orientation="left" />
      <spn-heatmap
        xDataKey="var2"
        yDataKey="var1"
        valueDataKey="correlation"
        name="Correlation"
        colorScheme="RdYlBu"
        [valueDomain]="[-1, 1]"
        [cellPadding]="2"
        [cellRadius]="2"
      />
      <spn-tooltip separator=": " />
    </spn-heatmap-chart>
  \`,
})
export class CorrelationMatrixExampleComponent {
  protected readonly chartData = this.generateCorrelationMatrix();
  protected readonly margin = { top: 20, right: 30, bottom: 60, left: 80 };

  private generateCorrelationMatrix() {
    const variables = ['Revenue', 'Marketing', 'R&D', 'Support', 'Sales'];
    const correlations = {
      'Revenue': { 'Revenue': 1.0, 'Marketing': 0.85, 'R&D': 0.45, 'Support': 0.32, 'Sales': 0.92 },
      'Marketing': { 'Revenue': 0.85, 'Marketing': 1.0, 'R&D': 0.28, 'Support': 0.15, 'Sales': 0.78 },
      'R&D': { 'Revenue': 0.45, 'Marketing': 0.28, 'R&D': 1.0, 'Support': -0.12, 'Sales': 0.35 },
      'Support': { 'Revenue': 0.32, 'Marketing': 0.15, 'R&D': -0.12, 'Support': 1.0, 'Sales': 0.42 },
      'Sales': { 'Revenue': 0.92, 'Marketing': 0.78, 'R&D': 0.35, 'Support': 0.42, 'Sales': 1.0 },
    };

    const data = [];
    variables.forEach((var1) => {
      variables.forEach((var2) => {
        data.push({ var1, var2, correlation: correlations[var1][var2] });
      });
    });

    return data;
  }
}`;

export const WITH_LABELS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
  SpnTooltip,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-with-labels-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap, SpnTooltip],
  template: \`
    <spn-heatmap-chart [data]="chartData" width="700" height="350" [margin]="margin">
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" />
      <spn-heatmap
        xDataKey="hour"
        yDataKey="day"
        valueDataKey="value"
        colorScheme="blues"
        [label]="true"
        [cellPadding]="2"
      />
      <spn-tooltip separator=": " />
    </spn-heatmap-chart>
  \`,
})
export class WithLabelsHeatmapExampleComponent {
  protected readonly chartData = [
    { day: 'Mon', hour: '9am', value: 45 },
    { day: 'Mon', hour: '10am', value: 78 },
    { day: 'Mon', hour: '11am', value: 92 },
    // ... more data
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 60 };
}`;

export const HOVER_EFFECTS_HEATMAP_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHeatmapChart,
  SpnXAxis,
  SpnYAxis,
  SpnHeatmap,
  SpnTooltip,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-hover-effects-heatmap-example',
  imports: [SpnHeatmapChart, SpnXAxis, SpnYAxis, SpnHeatmap, SpnTooltip],
  template: \`
    <spn-heatmap-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis dataKey="hour" orientation="bottom" />
      <spn-y-axis dataKey="day" orientation="left" />
      <spn-heatmap
        xDataKey="hour"
        yDataKey="day"
        valueDataKey="value"
        name="Activity"
        colorScheme="blues"
        [cellPadding]="2"
        [cellRadius]="4"
        hoverStroke="#1e40af"
        [hoverStrokeWidth]="3"
        [dimOthers]="true"
        [dimOpacity]="0.3"
        [hoverTransitionDuration]="150"
      />
      <spn-tooltip separator=": " />
    </spn-heatmap-chart>
  \`,
})
export class HoverEffectsHeatmapExampleComponent {
  protected readonly chartData = this.generateData();
  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 60 };

  private generateData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
    const data = [];

    days.forEach((day) => {
      hours.forEach((hour) => {
        const baseValue = ['10am', '11am', '2pm', '3pm'].includes(hour) ? 60 : 30;
        data.push({ day, hour, value: baseValue + Math.floor(Math.random() * 40) });
      });
    });

    return data;
  }
}`;
