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
import { DataKey, HeatmapColorScheme, HeatmapLabelConfig } from '../types';

/**
 * Heatmap configuration component.
 * Does not render anything - provides configuration to parent chart.
 * Registers itself with the chart context for tooltips and legends.
 */
@Component({
  selector: 'spn-heatmap',
  template: '',
  host: { style: 'display: none' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnHeatmap implements OnDestroy {
  private readonly chartContext = inject(ChartContextService, {
    optional: true,
  });
  private readonly elementId = `heatmap-${Math.random().toString(36).substr(2, 9)}`;

  // Required - data keys for the 3 dimensions
  readonly xDataKey = input.required<DataKey>();  // Column categories
  readonly yDataKey = input.required<DataKey>();  // Row categories
  readonly valueDataKey = input.required<DataKey>();  // Cell value

  // Color configuration
  readonly colorScheme = input<HeatmapColorScheme>('blues');  // Preset schemes
  readonly minColor = input<string>();  // Override min color
  readonly maxColor = input<string>();  // Override max color
  readonly nullColor = input<string>('#f5f5f5');  // Color for missing values

  // Domain
  readonly valueDomain = input<[number, number]>();  // Override auto-detected min/max

  // Styling
  readonly cellPadding = input(1, { transform: numberAttribute });  // Gap between cells
  readonly cellRadius = input(0, { transform: numberAttribute });  // Rounded corners

  // Display
  readonly name = input<string>();
  readonly hide = input(false, { transform: booleanAttribute });

  // Label configuration
  readonly label = input<boolean | HeatmapLabelConfig>(false);  // Show value labels in cells

  // Animation
  readonly isAnimationActive = input(true, { transform: booleanAttribute });
  readonly animationDuration = input(400, { transform: numberAttribute });
  readonly animationEasing = input<string>('ease-in-out');

  // Hover effects configuration
  readonly hoverStroke = input<string>(); // Stroke color on hover (default: inherit)
  readonly hoverStrokeWidth = input(2, { transform: numberAttribute }); // Stroke width on hover
  readonly hoverOpacity = input(1, { transform: numberAttribute }); // Opacity on hover
  readonly dimOthers = input(false, { transform: booleanAttribute }); // Dim non-hovered elements
  readonly dimOpacity = input(0.3, { transform: numberAttribute }); // Opacity of dimmed elements
  readonly hoverTransitionDuration = input(150, { transform: numberAttribute }); // Transition duration in ms

  constructor() {
    // Register this heatmap with the chart context for tooltips and legends
    const chartContext = this.chartContext;
    if (chartContext) {
      effect(() => {
        chartContext.registerGraphicalElement({
          id: this.elementId,
          dataKey: this.valueDataKey(),
          name: this.name() || 'Value',
          color: this.colorScheme(), // Color scheme name - heatmaps use color scales
          type: 'heatmap',
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
