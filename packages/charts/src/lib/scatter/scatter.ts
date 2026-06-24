import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  numberAttribute,
  OnDestroy,
} from '@angular/core';
import { ChartContextService } from '../chart-context.service';
import { ChartData, CurveType, DataKey, ScatterShape } from '../types';

/**
 * Scatter configuration component.
 * Does not render anything - provides configuration to parent chart.
 * Registers itself with the chart context for tooltips and legends.
 */
@Component({
  selector: 'spn-scatter',
  template: '',
  host: { style: 'display: none' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnScatter<T = unknown> implements OnDestroy {
  private readonly chartContext = inject(ChartContextService, {
    optional: true,
  });
  private readonly elementId = `scatter-${Math.random().toString(36).substr(2, 9)}`;

  // Required - BOTH x and y data keys (unlike Line which uses chart's x-axis)
  readonly xDataKey = input.required<DataKey<T>>();
  readonly yDataKey = input.required<DataKey<T>>();

  // Optional per-scatter data override
  readonly data = input<ChartData<T>>();

  // Display
  readonly name = input<string>();
  readonly fill = input<string>('#8884d8');
  readonly stroke = input<string>();
  readonly strokeWidth = input(0, { transform: numberAttribute });
  readonly opacity = input(1, { transform: numberAttribute });

  // Point sizing (area in px^2, like Recharts)
  readonly size = input(64, { transform: numberAttribute });
  readonly shape = input<ScatterShape>('circle'); // Future extensibility

  // Line connection (for connected scatter)
  readonly line = input(false, { transform: booleanAttribute });
  readonly lineStroke = input<string>(); // Defaults to fill
  readonly lineStrokeWidth = input(1, { transform: numberAttribute });
  readonly lineCurve = input<CurveType>('linear');

  // Axis references
  readonly xAxisId = input<string>('default');
  readonly yAxisId = input<string>('default');

  // Visibility & Animation
  readonly hide = input(false, { transform: booleanAttribute });
  readonly isAnimationActive = input(true, { transform: booleanAttribute });
  readonly animationDuration = input(400, { transform: numberAttribute });
  readonly animationEasing = input<string>('ease-in-out');

  // Active point (hover) styling
  readonly activeSize = input(100, { transform: numberAttribute });
  readonly activeFill = input<string>(); // Defaults to fill
  readonly activeStroke = input<string>('#fff');
  readonly activeStrokeWidth = input(2, { transform: numberAttribute });

  constructor() {
    // Register this scatter with the chart context for tooltips and legends
    const chartContext = this.chartContext;
    if (chartContext) {
      effect(() => {
        chartContext.registerGraphicalElement({
          id: this.elementId,
          dataKey: this.yDataKey() as DataKey,
          name: this.name() || String(this.yDataKey()),
          color: this.fill(),
          type: 'scatter',
          hide: this.hide(),
        });
      });
    }
  }

  ngOnDestroy(): void {
    // Unregister when component is destroyed
    if (this.chartContext) {
      this.chartContext.unregisterGraphicalElement(this.elementId);
    }
  }
}
