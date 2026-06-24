import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  inject,
  input,
  numberAttribute,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  HeatmapLegendContext,
  HeatmapLegendTick,
  HeatmapLegendTickContext,
} from '../types';

/**
 * Directive to define a custom template for the entire heatmap legend content.
 * Full replacement - you control gradient and labels rendering.
 *
 * @example
 * ```html
 * <spn-heatmap-legend>
 *   <ng-template spnHeatmapLegendContent let-ticks let-gradientStyle="gradientStyle">
 *     <div class="my-legend">
 *       <div [style.background]="gradientStyle" class="gradient-bar"></div>
 *       @for (tick of ticks; track tick.value) {
 *         <span>{{ tick.formattedLabel }}</span>
 *       }
 *     </div>
 *   </ng-template>
 * </spn-heatmap-legend>
 * ```
 */
@Directive({ selector: 'ng-template[spnHeatmapLegendContent]', standalone: true })
export class SpnHeatmapLegendContentDef {
  readonly template = inject<TemplateRef<HeatmapLegendContext>>(TemplateRef);
}

/**
 * Directive to define a custom template for individual heatmap legend tick labels.
 *
 * @example
 * ```html
 * <spn-heatmap-legend>
 *   <ng-template spnHeatmapLegendTick let-tick>
 *     <span class="custom-tick" [style]="tick.style">
 *       {{ tick.value | number:'1.0-0' }}%
 *     </span>
 *   </ng-template>
 * </spn-heatmap-legend>
 * ```
 */
@Directive({ selector: 'ng-template[spnHeatmapLegendTick]', standalone: true })
export class SpnHeatmapLegendTickDef {
  readonly template = inject<TemplateRef<HeatmapLegendTickContext>>(TemplateRef);
}

/**
 * Heatmap color legend component.
 * Renders a gradient bar showing the color scale with min/max labels.
 *
 * Supports custom templates via:
 * - `spnHeatmapLegendContent` - Full replacement of entire legend
 * - `spnHeatmapLegendTick` - Custom template for each tick label
 */
@Component({
  selector: 'spn-heatmap-legend',
  imports: [NgTemplateOutlet],
  template: `
    @if (!hide()) {
      <!-- Full content template override -->
      @if (contentTemplate()?.template; as template) {
        <ng-container *ngTemplateOutlet="template; context: createLegendContext()" />
      } @else {
        <div class="spn-heatmap-legend" [class]="positionClass()">
          <div
            class="spn-heatmap-legend-gradient"
            [style.background]="gradientStyle()"
            [style.width.px]="isVertical() ? width() : height()"
            [style.height.px]="isVertical() ? height() : width()"
          ></div>
          @if (showLabels()) {
            <div class="spn-heatmap-legend-labels" [class.vertical]="isVertical()">
              @for (tick of ticksWithLabels(); track tick.value; let i = $index) {
                <!-- Tick template override -->
                @if (tickTemplate()?.template; as template) {
                  <ng-container *ngTemplateOutlet="template; context: createTickContext(tick, i)" />
                } @else {
                  <span class="spn-heatmap-legend-label" [style]="tick.style">
                    {{ tick.formattedLabel }}
                  </span>
                }
              }
            </div>
          }
        </div>
      }
    }
  `,
  styles: [
    `
      .spn-heatmap-legend {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
      }

      .spn-heatmap-legend.right {
        flex-direction: row;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      .spn-heatmap-legend.bottom {
        flex-direction: column;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .spn-heatmap-legend-gradient {
        border-radius: 2px;
      }

      .spn-heatmap-legend-labels {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #666;
      }

      .spn-heatmap-legend-labels.vertical {
        flex-direction: column;
        height: 100%;
      }

      .spn-heatmap-legend-label {
        white-space: nowrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnHeatmapLegend {
  // Position
  readonly position = input<'right' | 'bottom'>('right');
  readonly width = input(20, { transform: numberAttribute });  // Width of the gradient bar
  readonly height = input(200, { transform: numberAttribute });  // Height of the gradient bar

  // Labels
  readonly showLabels = input(true, { transform: booleanAttribute });
  readonly labelFormatter = input<(value: number) => string>();
  readonly tickCount = input(5, { transform: numberAttribute });

  // Visibility
  readonly hide = input(false, { transform: booleanAttribute });

  // Color scale info (set by parent chart)
  readonly minValue = input<number>(0);
  readonly maxValue = input<number>(100);
  readonly colorInterpolator = input<(t: number) => string>();

  // Template queries
  readonly contentTemplate = contentChild(SpnHeatmapLegendContentDef);
  readonly tickTemplate = contentChild(SpnHeatmapLegendTickDef);

  readonly isVertical = computed(() => this.position() === 'right');

  readonly positionClass = computed(() => this.position());

  readonly gradientStyle = computed(() => {
    const interpolator = this.colorInterpolator();
    if (!interpolator) {
      return 'linear-gradient(to top, #f7fbff, #08306b)';
    }

    // Generate gradient stops
    const stops: string[] = [];
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      const t = i / numStops;
      const color = interpolator(t);
      const percent = this.isVertical() ? (1 - t) * 100 : t * 100;
      stops.push(`${color} ${percent}%`);
    }

    const direction = this.isVertical() ? 'to bottom' : 'to right';
    return `linear-gradient(${direction}, ${stops.join(', ')})`;
  });

  /**
   * Ticks with formatted labels for template use
   */
  readonly ticksWithLabels = computed((): HeatmapLegendTick[] => {
    const min = this.minValue();
    const max = this.maxValue();
    const count = this.tickCount();
    const isVert = this.isVertical();

    const ticks: HeatmapLegendTick[] = [];

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const value = min + t * (max - min);

      // Position calculation
      const percent = isVert ? t * 100 : t * 100;
      const style: Record<string, string> = isVert
        ? { position: 'absolute', top: `${percent}%`, transform: 'translateY(-50%)' }
        : { position: 'absolute', left: `${percent}%`, transform: 'translateX(-50%)' };

      ticks.push({
        value,
        formattedLabel: this.formatLabel(value),
        percent,
        style,
      });
    }

    return ticks;
  });

  formatLabel(value: number): string {
    const formatter = this.labelFormatter();
    if (formatter) {
      return formatter(value);
    }
    // Default formatting - show 0-2 decimal places
    return value % 1 === 0 ? String(value) : value.toFixed(1);
  }

  /**
   * Creates context for spnHeatmapLegendContent template
   */
  protected createLegendContext(): HeatmapLegendContext {
    const interpolator = this.colorInterpolator();
    return {
      $implicit: this.ticksWithLabels(),
      ticks: this.ticksWithLabels(),
      minValue: this.minValue(),
      maxValue: this.maxValue(),
      colorInterpolator: interpolator ?? ((t: number) => `rgb(${Math.round(247 - t * 239)}, ${Math.round(251 - t * 202)}, ${Math.round(255 - t * 148)})`),
      isVertical: this.isVertical(),
      gradientStyle: this.gradientStyle(),
      width: this.width(),
      height: this.height(),
    };
  }

  /**
   * Creates context for spnHeatmapLegendTick template
   */
  protected createTickContext(tick: HeatmapLegendTick, index: number): HeatmapLegendTickContext {
    return {
      $implicit: tick,
      tick,
      index,
    };
  }
}
