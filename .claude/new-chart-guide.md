# Creating a New Chart Type

This guide walks through creating a new chart type (e.g., BarChart, AreaChart).

## Step 1: Create Directory Structure

```
packages/charts/src/lib/
├── bar-chart/
│   └── bar-chart.ts
├── bar/
│   └── bar.ts
```

## Step 2: Create the Graphical Component (Config)

The graphical component (e.g., SpnBar) is a **config collector** - it only exposes inputs.

```typescript
// packages/charts/src/lib/bar/bar.ts
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  numberAttribute,
} from '@angular/core';
import { DataKey } from '../types';

@Component({
  selector: 'spn-bar',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: none' },
})
export class SpnBar<T = unknown> {
  // Required
  readonly dataKey = input.required<DataKey<T>>();

  // Styling
  readonly fill = input<string>('#8884d8');
  readonly stroke = input<string | undefined>(undefined);
  readonly strokeWidth = input(0, { transform: numberAttribute });
  readonly radius = input(0, { transform: numberAttribute });

  // Axis references
  readonly xAxisId = input<string>('default');
  readonly yAxisId = input<string>('default');

  // Animation
  readonly isAnimationActive = input(true, { transform: booleanAttribute });
  readonly animationDuration = input(300, { transform: numberAttribute });

  // Metadata
  readonly name = input<string | undefined>(undefined);
  readonly hide = input(false, { transform: booleanAttribute });
}
```

## Step 3: Create the Container Component

The container queries children and renders all SVG.

```typescript
// packages/charts/src/lib/bar-chart/bar-chart.ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  contentChildren,
  effect,
  inject,
  input,
  numberAttribute,
  viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { ChartContextService } from '../chart-context.service';
import { ChartData, ChartMargin, DataKey, getValueByDataKey } from '../types';
import { SpnXAxis } from '../x-axis/x-axis';
import { SpnYAxis } from '../y-axis/y-axis';
import { SpnBar } from '../bar/bar';

@Component({
  selector: 'spn-bar-chart',
  standalone: true,
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
    >
      <g [attr.transform]="'translate(' + margin().left + ',' + margin().top + ')'">
        <ng-content />
        <g #axesLayer class="axes-layer"></g>
        <g #barsLayer class="bars-layer"></g>
      </g>
    </svg>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChartContextService],
})
export class SpnBarChart<T = unknown> {
  // Inputs
  readonly data = input.required<ChartData<T>>();
  readonly width = input(600, { transform: numberAttribute });
  readonly height = input(400, { transform: numberAttribute });
  readonly margin = input<ChartMargin>({ top: 20, right: 20, bottom: 30, left: 40 });

  // Query children
  readonly xAxes = contentChildren(SpnXAxis);
  readonly yAxes = contentChildren(SpnYAxis);
  readonly bars = contentChildren(SpnBar);

  // View refs for D3
  readonly axesLayer = viewChild.required<ElementRef<SVGGElement>>('axesLayer');
  readonly barsLayer = viewChild.required<ElementRef<SVGGElement>>('barsLayer');

  private readonly chartContext = inject(ChartContextService);

  constructor() {
    // Render when any dependency changes
    effect(() => {
      const data = this.data();
      const width = this.width();
      const height = this.height();
      const margin = this.margin();
      const xAxes = this.xAxes();
      const yAxes = this.yAxes();
      const bars = this.bars();

      if (!data.length || !xAxes.length || !yAxes.length) return;

      this.render();
    });
  }

  private render(): void {
    // Clear previous
    d3.select(this.axesLayer().nativeElement).selectAll('*').remove();
    d3.select(this.barsLayer().nativeElement).selectAll('*').remove();

    // Calculate dimensions
    const innerWidth = this.width() - this.margin().left - this.margin().right;
    const innerHeight = this.height() - this.margin().top - this.margin().bottom;

    // Create scales and render axes
    this.xAxes().forEach(xAxis => {
      const scale = this.createXScale(xAxis, innerWidth);
      this.chartContext.registerXScale(scale, xAxis.axisId());
      this.renderXAxis(xAxis, scale, innerHeight);
    });

    this.yAxes().forEach(yAxis => {
      const scale = this.createYScale(yAxis, innerHeight);
      this.chartContext.registerYScale(scale, yAxis.axisId());
      this.renderYAxis(yAxis, scale);
    });

    // Render bars
    this.bars().forEach(bar => {
      if (!bar.hide()) {
        this.renderBar(bar, innerWidth, innerHeight);
      }
    });
  }

  private createXScale(xAxis: SpnXAxis, width: number): d3.ScaleBand<string> {
    const data = this.data();
    const dataKey = xAxis.dataKey() as DataKey<T>;

    return d3.scaleBand<string>()
      .domain(data.map(d => String(getValueByDataKey(d, dataKey))))
      .range([0, width])
      .padding(0.1);
  }

  private createYScale(yAxis: SpnYAxis, height: number): d3.ScaleLinear<number, number> {
    const data = this.data();
    const dataKey = yAxis.dataKey() as DataKey<T>;

    const values = data.map(d => Number(getValueByDataKey(d, dataKey)));
    const max = d3.max(values) ?? 0;

    return d3.scaleLinear()
      .domain([0, max])
      .range([height, 0])
      .nice();
  }

  private renderXAxis(xAxis: SpnXAxis, scale: d3.ScaleBand<string>, height: number): void {
    const axisGenerator = d3.axisBottom(scale);

    d3.select(this.axesLayer().nativeElement)
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisGenerator);
  }

  private renderYAxis(yAxis: SpnYAxis, scale: d3.ScaleLinear<number, number>): void {
    const axisGenerator = d3.axisLeft(scale);

    d3.select(this.axesLayer().nativeElement)
      .append('g')
      .call(axisGenerator);
  }

  private renderBar(bar: SpnBar<T>, innerWidth: number, innerHeight: number): void {
    const data = this.data();
    const xScale = this.chartContext.getXScale(bar.xAxisId()) as d3.ScaleBand<string>;
    const yScale = this.chartContext.getYScale(bar.yAxisId()) as d3.ScaleLinear<number, number>;
    const xAxis = this.xAxes()[0];
    const xDataKey = xAxis.dataKey() as DataKey<T>;
    const yDataKey = bar.dataKey();

    d3.select(this.barsLayer().nativeElement)
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => xScale(String(getValueByDataKey(d, xDataKey))) ?? 0)
      .attr('y', d => yScale(Number(getValueByDataKey(d, yDataKey))))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(Number(getValueByDataKey(d, yDataKey))))
      .attr('fill', bar.fill())
      .attr('rx', bar.radius())
      .attr('ry', bar.radius());
  }
}
```

## Step 4: Export Components

```typescript
// packages/charts/src/lib/index.ts
export * from './bar-chart/bar-chart';
export * from './bar/bar';
```

## Step 5: Add Documentation Example

Create an example in `apps/documentation/src/app/examples/`.

## Checklist

- [ ] Config component has empty template
- [ ] Config component uses `host: { style: 'display: none' }`
- [ ] Container queries children with `contentChildren()`
- [ ] All inputs use `input()` signals
- [ ] Number inputs use `{ transform: numberAttribute }`
- [ ] Boolean inputs use `{ transform: booleanAttribute }`
- [ ] OnPush change detection on all components
- [ ] All components are standalone
- [ ] Exported from index.ts
- [ ] Documentation example added
