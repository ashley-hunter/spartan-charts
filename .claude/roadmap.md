# Development Roadmap

## Current Status

Core line chart implementation complete with:
- SpnLineChart, SpnXAxis, SpnYAxis, SpnLine
- CartesianGrid, Tooltip, Legend, ReferenceLine

## Next Steps

### Additional Chart Types

| Component | Container | Graphical | Priority |
|-----------|-----------|-----------|----------|
| Bar Chart | SpnBarChart | SpnBar | High |
| Area Chart | SpnAreaChart | SpnArea | High |
| Scatter Chart | SpnScatterChart | SpnScatter | Medium |
| Pie Chart | SpnPieChart | SpnPie | Medium |
| Composed Chart | SpnComposedChart | - | Low |

### Features to Add

**High Priority:**
- ResponsiveContainer - Auto-sizing wrapper
- Stacking support - Stack multiple series with `stackId`
- Interactive events - Click, hover, selection handlers

**Medium Priority:**
- Reference elements - ReferenceArea, ReferenceDot
- Brush component - Interactive zoom/pan control
- Custom shapes - Template/function-based renderers

**Lower Priority:**
- Synchronized charts - Link multiple charts
- Data transformations - Built-in aggregations
- Export - PNG/SVG download
- Themes - Pre-built color schemes
- Accessibility - ARIA labels, keyboard navigation

## Testing Needs

- Unit tests for helper functions in `types.ts`
- Component tests for chart rendering
- Integration tests for composed charts
- Performance tests for large datasets
