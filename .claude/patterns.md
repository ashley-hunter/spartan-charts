# Coding Patterns & Conventions

## Component Architecture

### Config-Collector Pattern

Child components are **configuration collectors only** - they don't render anything. The parent chart queries children and handles all SVG rendering.

```typescript
// Config component - NO rendering, just inputs
@Component({
  selector: 'spn-my-config',
  template: '',  // Empty!
  host: { style: 'display: none' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnMyConfig {
  readonly dataKey = input.required<DataKey<unknown>>();
  readonly stroke = input<string>('#8884d8');
  // ... more config inputs
}
```

```typescript
// Container component - queries children, renders everything
@Component({
  selector: 'spn-my-chart',
  template: `
    <svg>
      <ng-content />  <!-- Hidden config components -->
      <g class="render-layer"></g>  <!-- Actual SVG rendered here -->
    </svg>
  `,
})
export class SpnMyChart {
  readonly configs = contentChildren(SpnMyConfig);

  constructor() {
    effect(() => {
      this.configs().forEach(config => {
        // Read config and render
        const stroke = config.stroke();
        this.renderElement(stroke);
      });
    });
  }
}
```

## Signal Usage

### Inputs

Always use signal inputs, never `@Input()` decorator:

```typescript
// Required inputs
readonly data = input.required<ChartData<T>>();

// Optional with default
readonly width = input<number>(600);

// With transform for primitives
readonly strokeWidth = input(1, { transform: numberAttribute });
readonly hide = input(false, { transform: booleanAttribute });
```

### Computed Values

Use `computed()` for derived state:

```typescript
readonly innerWidth = computed(() =>
  this.width() - this.margin().left - this.margin().right
);
```

### Effects

Use `effect()` for D3 rendering side effects:

```typescript
constructor() {
  effect(() => {
    // Dependencies are tracked automatically
    const data = this.data();
    const width = this.width();
    this.render(data, width);
  });
}
```

## D3 Integration

### Scale Creation

```typescript
// Category scale (for names, labels)
const xScale = d3.scaleBand()
  .domain(data.map(d => String(getValueByDataKey(d, dataKey))))
  .range([0, innerWidth])
  .padding(0.1);

// Linear scale (for numbers)
const yScale = d3.scaleLinear()
  .domain([min, max])
  .range([innerHeight, 0])
  .nice();

// Time scale (for dates)
const timeScale = d3.scaleTime()
  .domain([startDate, endDate])
  .range([0, innerWidth]);
```

### Axis Rendering

```typescript
const axisGenerator = d3.axisBottom(scale)
  .ticks(tickCount)
  .tickFormat(formatter);

d3.select(this.axisGroup)
  .call(axisGenerator);
```

### Line Generation

```typescript
const lineGenerator = d3.line<T>()
  .x(d => xScale(getValueByDataKey(d, xDataKey)))
  .y(d => yScale(getValueByDataKey(d, yDataKey)))
  .curve(CURVE_MAP[curveType]);
```

## Type Patterns

### Generic Chart Data

```typescript
// Data is generic, allowing any shape
interface ChartData<T> extends Array<T> {}

// DataKey extracts values from data
type DataKey<T> = keyof T | ((item: T) => unknown);

// Helper to get value
function getValueByDataKey<T>(item: T, dataKey: DataKey<T>): unknown {
  if (typeof dataKey === 'function') {
    return dataKey(item);
  }
  return (item as Record<string, unknown>)[dataKey as string];
}
```

### Axis Types

```typescript
type AxisType = 'number' | 'category' | 'time';
type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';
```

## File Organization

Each component gets its own directory:

```
packages/charts/src/lib/
├── my-component/
│   └── my-component.ts    # Component + types
├── types.ts               # Shared types
├── chart-context.service.ts
└── index.ts               # Public exports
```

## Change Detection

Always use OnPush:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

## Avoiding Common Mistakes

1. **Don't render in config components** - Only expose inputs
2. **Don't use `@Input()`** - Use `input()` signals
3. **Don't mutate state** - Create new objects/arrays
4. **Don't forget numberAttribute/booleanAttribute** - For primitive inputs
5. **Don't suppress ESLint** - Fix the type instead
