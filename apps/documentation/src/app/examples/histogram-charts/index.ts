// Example components
export { BasicHistogramExampleComponent } from './basic-histogram.example';
export { CustomBinsExampleComponent } from './custom-bins.example';
export { CustomThresholdsExampleComponent } from './custom-thresholds.example';
export { StyledHistogramExampleComponent } from './styled-histogram.example';
export { HistogramTooltipExampleComponent } from './tooltip.example';
export { GridHistogramExampleComponent } from './grid-histogram.example';

// Source code as strings
export const BASIC_HISTOGRAM_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-basic-histogram-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram],
  template: \`
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram dataKey="age" fill="#3b82f6" />
    </spn-histogram-chart>
  \`,
})
export class BasicHistogramExampleComponent {
  protected readonly chartData = [
    { age: 23 }, { age: 25 }, { age: 31 }, { age: 28 },
    { age: 35 }, { age: 42 }, { age: 38 }, { age: 29 },
    { age: 45 }, { age: 52 }, { age: 33 }, { age: 27 },
    { age: 24 }, { age: 36 }, { age: 41 }, { age: 30 },
    { age: 26 }, { age: 34 }, { age: 39 }, { age: 48 },
    { age: 22 }, { age: 37 }, { age: 44 }, { age: 32 },
    { age: 29 }, { age: 35 }, { age: 40 }, { age: 28 },
    { age: 31 }, { age: 46 }, { age: 33 }, { age: 25 },
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const CUSTOM_BINS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-custom-bins-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid],
  template: \`
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram dataKey="score" fill="#8b5cf6" [binCount]="15" />
    </spn-histogram-chart>
  \`,
})
export class CustomBinsExampleComponent {
  protected readonly chartData = this.generateScoreData(100);

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  private generateScoreData(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
      const score = Math.round(
        Math.min(100, Math.max(0, 70 + (Math.random() - 0.5) * 40))
      );
      data.push({ score });
    }
    return data;
  }
}`;

export const CUSTOM_THRESHOLDS_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-custom-thresholds-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid],
  template: \`
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram
        dataKey="salary"
        fill="#10b981"
        [thresholds]="salaryThresholds"
        name="Salary Distribution"
      />
    </spn-histogram-chart>
  \`,
})
export class CustomThresholdsExampleComponent {
  // Custom salary brackets (in thousands)
  protected readonly salaryThresholds = [30, 40, 50, 60, 75, 90, 110, 130, 150];

  protected readonly chartData = [
    { salary: 35 }, { salary: 42 }, { salary: 48 }, { salary: 55 },
    { salary: 62 }, { salary: 58 }, { salary: 45 }, { salary: 72 },
    { salary: 85 }, { salary: 95 }, { salary: 68 }, { salary: 52 },
    { salary: 78 }, { salary: 88 }, { salary: 105 }, { salary: 115 },
    // ... more data
  ];

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };
}`;

export const STYLED_HISTOGRAM_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-styled-histogram-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid],
  template: \`
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram
        dataKey="value"
        fill="#ec4899"
        stroke="#be185d"
        strokeWidth="2"
        opacity="0.8"
        [binCount]="12"
      />
    </spn-histogram-chart>
  \`,
})
export class StyledHistogramExampleComponent {
  protected readonly chartData = this.generateData(80);

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  private generateData(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
      const value = Math.round(50 + Math.random() * 100 - 25);
      data.push({ value });
    }
    return data;
  }
}`;

export const HISTOGRAM_TOOLTIP_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnLegend,
  SpnTooltip,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-histogram-tooltip-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid, SpnLegend, SpnTooltip],
  template: \`
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram
        dataKey="responseTime"
        fill="#f59e0b"
        name="Response Time (ms)"
        [binCount]="10"
      />
      <spn-legend align="center" verticalAlign="top" />
      <spn-tooltip [cursor]="true" separator=" : " />
    </spn-histogram-chart>
  \`,
})
export class HistogramTooltipExampleComponent {
  protected readonly chartData = this.generateResponseTimeData(150);

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  private generateResponseTimeData(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
      let responseTime;
      const rand = Math.random();
      if (rand < 0.7) {
        responseTime = 100 + Math.random() * 100;
      } else if (rand < 0.9) {
        responseTime = 200 + Math.random() * 150;
      } else {
        responseTime = 350 + Math.random() * 150;
      }
      data.push({ responseTime: Math.round(responseTime) });
    }
    return data;
  }
}`;

export const GRID_HISTOGRAM_SOURCE = `import { Component } from '@angular/core';
import {
  SpnHistogramChart,
  SpnCartesianGrid,
  SpnXAxis,
  SpnYAxis,
  SpnHistogram,
  SpnReferenceLine,
} from '@spartan-ng/charts';

@Component({
  selector: 'app-grid-histogram-example',
  imports: [SpnHistogramChart, SpnXAxis, SpnYAxis, SpnHistogram, SpnCartesianGrid, SpnReferenceLine],
  template: \`
    <spn-histogram-chart [data]="chartData" width="700" height="400" [margin]="margin">
      <spn-cartesian-grid stroke="#374151" strokeDasharray="3 3" [horizontal]="true" [vertical]="true" />
      <spn-x-axis orientation="bottom" type="number" />
      <spn-y-axis orientation="left" type="number" />
      <spn-histogram
        dataKey="temperature"
        fill="#06b6d4"
        name="Temperature Distribution"
        [binCount]="12"
      />
      <spn-reference-line x="75" stroke="#ef4444" strokeDasharray="5 5" label="Avg: 75°F" />
    </spn-histogram-chart>
  \`,
})
export class GridHistogramExampleComponent {
  protected readonly chartData = this.generateTemperatureData(60);

  protected readonly margin = { top: 20, right: 30, bottom: 40, left: 50 };

  private generateTemperatureData(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
      const temperature = Math.round(75 + (Math.random() - 0.5) * 30);
      data.push({ temperature });
    }
    return data;
  }
}`;
