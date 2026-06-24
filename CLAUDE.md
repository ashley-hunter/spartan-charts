# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spartan Charts is an Angular charting library inspired by Recharts, providing a declarative, composable API for building charts with D3 and Angular signals. It uses a **config-collector pattern** where child components act as configuration providers rather than renderers.

## Commands

```bash
# Build the library
npx nx build charts

# Run tests
npx nx test charts

# Lint
npx nx lint charts

# Serve documentation app (development)
npx nx serve documentation

# Build documentation (production)
npx nx build documentation
```

## Architecture

### Config-Collector Pattern

Child components (`SpnXAxis`, `SpnYAxis`, `SpnLine`, etc.) are **configuration collectors only** - they expose signal-based inputs but don't render anything. The parent chart component (`SpnLineChart`) queries these children via `contentChildren()` and handles all SVG rendering.

```
User Template                    SpnLineChart
┌─────────────────────┐         ┌─────────────────────────────┐
│ <spn-line-chart>    │         │ 1. Query contentChildren()  │
│   <spn-x-axis />    │ ──────► │ 2. Read config via signals  │
│   <spn-y-axis />    │         │ 3. Create D3 scales         │
│   <spn-line />      │         │ 4. Render all SVG elements  │
│ </spn-line-chart>   │         └─────────────────────────────┘
└─────────────────────┘
```

### Key Patterns

- **Signal-based reactivity**: All inputs use `input()`, `input.required()` from Angular signals
- **OnPush change detection**: All components use OnPush
- **Standalone components**: No NgModule, all components are standalone
- **D3 integration**: Uses D3 for scales, axes, and line generators

### Directory Structure

```
packages/charts/src/lib/        # Main library
├── chart-context.service.ts    # Shared context via signals
├── types.ts                    # TypeScript types and helpers
├── line-chart/                 # Container component
├── x-axis/, y-axis/            # Axis config components
├── line/                       # Line config/renderer
├── cartesian-grid/             # Grid lines
├── legend/                     # Legend with toggles
├── reference-line/             # Reference lines
└── tooltip/                    # Hover tooltip

apps/documentation/             # Live examples app
```

### Component Types

| Component | Role | Renders |
|-----------|------|---------|
| SpnLineChart | Container | Yes - orchestrates all SVG |
| SpnXAxis, SpnYAxis | Config | No - data holders only |
| SpnLine | Config/Renderer | Partial - registers with container |
| SpnCartesianGrid, SpnLegend, SpnTooltip | Config/Renderer | Yes |

## Tech Stack

- Angular 21.1 with TypeScript 5.9
- D3.js 7.9 (scales, axes, line generators, curves)
- Nx 22.4 monorepo with pnpm
- Vitest for testing
- TailwindCSS for documentation styling

## Key Files

- `ARCHITECTURE.md` - Detailed architecture explanation with diagrams
- `packages/charts/src/lib/types.ts` - Type definitions and helper functions
- `packages/charts/src/lib/chart-context.service.ts` - Shared state management

## Development Guides (.claude/)

- `.claude/roadmap.md` - Feature roadmap and next steps
- `.claude/patterns.md` - Coding patterns and conventions for this project
- `.claude/new-chart-guide.md` - Step-by-step guide for creating new chart types
