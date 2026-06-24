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
import { DataKey } from '../types';

/**
 * Histogram configuration component.
 * Does not render anything - provides configuration to parent chart.
 * Registers itself with the chart context for tooltips and legends.
 */
@Component({
  selector: 'spn-histogram',
  template: '',
  host: { style: 'display: none' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnHistogram implements OnDestroy {
  private readonly chartContext = inject(ChartContextService, {
    optional: true,
  });
  private readonly elementId = `histogram-${Math.random().toString(36).substr(2, 9)}`;

  // Required - data key for values to bin
  readonly dataKey = input.required<DataKey>();

  // Binning configuration
  readonly binCount = input<number>(); // Number of bins (default: auto via Sturges' formula)
  readonly thresholds = input<number[]>(); // Custom bin boundaries (overrides binCount)
  readonly domain = input<[number, number]>(); // Min/max for binning (default: data extent)
  readonly nice = input(true, { transform: booleanAttribute }); // Round domain to nice values

  // Styling
  readonly fill = input<string>('#8884d8');
  readonly stroke = input<string>();
  readonly strokeWidth = input(0, { transform: numberAttribute });
  readonly opacity = input(1, { transform: numberAttribute });

  // Display
  readonly name = input<string>(); // For legend/tooltip
  readonly hide = input(false, { transform: booleanAttribute });

  // Animation configuration
  readonly isAnimationActive = input(true, { transform: booleanAttribute });
  readonly animationDuration = input(400, { transform: numberAttribute });
  readonly animationEasing = input<string>('ease-in-out');

  constructor() {
    // Register this histogram with the chart context for tooltips and legends
    const chartContext = this.chartContext;
    if (chartContext) {
      effect(() => {
        chartContext.registerGraphicalElement({
          id: this.elementId,
          dataKey: this.dataKey(),
          name: this.name() || String(this.dataKey()),
          color: this.fill(),
          type: 'histogram',
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
