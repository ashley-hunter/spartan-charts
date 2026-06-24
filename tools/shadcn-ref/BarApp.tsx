import { Bar, BarChart, CartesianGrid, LabelList, Legend, Rectangle, Tooltip, XAxis, YAxis } from 'recharts';
import { INTERACTIVE_DATA } from './interactiveData';

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const browserData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
];
const BROWSER_LABELS: Record<string, string> = {
  chrome: 'Chrome', safari: 'Safari', firefox: 'Firefox', edge: 'Edge', other: 'Other',
};
const negativeData = [
  { month: 'January', visitors: 186, fill: 'var(--chart-1)' },
  { month: 'February', visitors: 205, fill: 'var(--chart-1)' },
  { month: 'March', visitors: -207, fill: 'var(--chart-2)' },
  { month: 'April', visitors: 173, fill: 'var(--chart-1)' },
  { month: 'May', visitors: -209, fill: 'var(--chart-2)' },
  { month: 'June', visitors: 214, fill: 'var(--chart-1)' },
];

interface LabelCfg { offset: number; fontSize: number; dataKey?: string; position?: any; fill?: string; className?: string }
interface Series { dataKey: string; name: string; color: string; radius: number | [number, number, number, number]; label?: LabelCfg | LabelCfg[]; stackId?: string; activeIndex?: number; activeStrokeDasharray?: string }
interface Margin { top: number; right: number; bottom: number; left: number }
interface Variant {
  hideLabel: boolean;
  series: Series[];
  layout?: 'vertical' | 'horizontal';
  indicator?: 'dot' | 'dashed' | 'line';
  margin?: Margin;
  legend?: boolean;
  dataset?: 'browser' | 'negative' | 'interactive';
  categoryKey?: string;
  hideIndicator?: boolean;
  hideCategoryAxis?: boolean;
  dateAxis?: boolean;
}

const DESKTOP: Series = { dataKey: 'desktop', name: 'Desktop', color: 'var(--chart-1)', radius: 8 };
const MOBILE: Series = { dataKey: 'mobile', name: 'Mobile', color: 'var(--chart-2)', radius: 8 };

const VARIANTS: Record<string, Variant> = {
  default: { hideLabel: true, series: [DESKTOP] },
  horizontal: {
    hideLabel: true,
    layout: 'horizontal',
    margin: { top: 12, right: 12, bottom: 12, left: -20 },
    series: [{ ...DESKTOP, radius: 5 }],
  },
  multiple: {
    hideLabel: false,
    indicator: 'dashed',
    series: [{ ...DESKTOP, radius: 4 }, { ...MOBILE, radius: 4 }],
  },
  label: {
    hideLabel: true,
    margin: { top: 20, right: 12, bottom: 0, left: 12 },
    series: [{ ...DESKTOP, radius: 8, label: { offset: 12, fontSize: 12, className: 'fill-foreground' } }],
  },
  stacked: {
    hideLabel: true,
    legend: true,
    series: [
      { ...DESKTOP, radius: [0, 0, 4, 4], stackId: 'a' },
      { ...MOBILE, radius: [4, 4, 0, 0], stackId: 'a' },
    ],
  },
  mixed: {
    hideLabel: true,
    layout: 'horizontal',
    dataset: 'browser',
    categoryKey: 'browser',
    margin: { top: 12, right: 12, bottom: 12, left: 0 },
    series: [{ dataKey: 'visitors', name: 'Visitors', color: 'var(--chart-1)', radius: 5 }],
  },
  negative: {
    hideLabel: true,
    hideIndicator: true,
    hideCategoryAxis: true,
    dataset: 'negative',
    margin: { top: 24, right: 12, bottom: 24, left: 12 },
    series: [{ dataKey: 'visitors', name: 'Visitors', color: 'var(--chart-1)', radius: 4, label: { offset: 8, fontSize: 12, dataKey: 'month' } }],
  },
  active: {
    hideLabel: true,
    dataset: 'browser',
    categoryKey: 'browser',
    series: [{ dataKey: 'visitors', name: 'Visitors', color: 'var(--chart-1)', radius: 8, activeIndex: 2, activeStrokeDasharray: '4' }],
  },
  'label-custom': {
    hideLabel: false,
    indicator: 'line',
    layout: 'horizontal',
    hideCategoryAxis: true,
    margin: { top: 12, right: 28, bottom: 12, left: 6 },
    series: [{
      dataKey: 'desktop', name: 'Desktop', color: 'var(--chart-2)', radius: 4,
      label: [
        { dataKey: 'month', position: 'insideLeft', offset: 8, fontSize: 12, fill: 'hsl(var(--background))' },
        { dataKey: 'desktop', position: 'right', offset: 8, fontSize: 12, fill: 'hsl(var(--foreground))' },
      ],
    }],
  },
  interactive: {
    hideLabel: false,
    dataset: 'interactive',
    categoryKey: 'date',
    dateAxis: true,
    margin: { top: 12, right: 12, bottom: 0, left: 12 },
    series: [{ dataKey: 'desktop', name: 'Desktop', color: 'var(--chart-1)', radius: 0 }],
  },
};

function LegendContent({ payload }: any) {
  if (!payload?.length) return null;
  return (
    <div className="spn-legend-row">
      {payload.map((item: any, i: number) => (
        <div className="legend-item" key={i}>
          <span className="swatch" style={{ background: item.color }} />
          <span className="legend-label">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function makeTooltip(hideLabel: boolean, indicator: 'dot' | 'dashed' | 'line', hideIndicator = false, labelFormatter?: (l: any) => string) {
  return function TooltipContent(props: any) {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    const shownLabel = labelFormatter ? labelFormatter(label) : label;
    const nestLabel = payload.length === 1 && indicator === 'line';
    const showTopLabel = !hideLabel && !nestLabel;
    return (
      <div className="tt">
        {showTopLabel && <div className="tt-label">{shownLabel}</div>}
        {payload.map((item: any, i: number) => (
          <div className={`tt-row ${indicator !== 'line' ? 'tt-row-dot' : ''}`} key={i}>
            {!hideIndicator && <div
              className={`tt-ind tt-ind-${indicator}`}
              style={indicator === 'dashed'
                ? { borderColor: item.color, background: 'transparent' }
                : { background: item.color }}
            />}
            <div className={`tt-body ${nestLabel ? 'tt-nest' : ''}`}>
              <div className="tt-labels">
                {nestLabel && <span className="tt-label">{shownLabel}</span>}
                <span className="tt-name">{item.name}</span>
              </div>
              <span className="tt-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
}

export function BarApp() {
  const p = new URLSearchParams(location.search);
  const w = Number(p.get('w')) || 600;
  const h = Number(p.get('h')) || 300;
  const v = VARIANTS[p.get('chart') ?? 'default'] ?? VARIANTS.default;
  const TooltipContent = makeTooltip(v.hideLabel, v.indicator ?? 'dot', v.hideIndicator, v.dateAxis ? fmtDate : undefined);
  const horizontal = v.layout === 'horizontal';
  const margin = v.margin ?? { top: 12, right: 12, bottom: 0, left: 12 };
  const data = v.dataset === 'browser' ? browserData
    : v.dataset === 'negative' ? negativeData
    : v.dataset === 'interactive' ? INTERACTIVE_DATA
    : chartData;
  const categoryKey = v.categoryKey ?? 'month';
  const fmtCat = (value: string) =>
    v.dataset === 'browser' ? (BROWSER_LABELS[value] ?? value)
    : v.dataset === 'interactive' ? fmtDate(value)
    : value.slice(0, 3);

  return (
    <div className="chart" style={{ width: w, height: h }}>
      <BarChart width={w} height={h} data={data} margin={margin} layout={horizontal ? 'vertical' : 'horizontal'}>
        {horizontal ? (
          <>
            {v.hideCategoryAxis ? (
              <YAxis dataKey={categoryKey} type="category" hide />
            ) : (
              <YAxis
                dataKey={categoryKey}
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={fmtCat}
              />
            )}
            <XAxis dataKey={v.series[0].dataKey} type="number" hide />
          </>
        ) : (
          <>
            <CartesianGrid vertical={false} />
            {!v.hideCategoryAxis && (
              <XAxis
                dataKey={categoryKey}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={v.dateAxis ? 32 : undefined}
                tickFormatter={fmtCat}
              />
            )}
          </>
        )}
        <Tooltip cursor={false} content={<TooltipContent />} />
        {v.legend && <Legend content={<LegendContent />} />}
        {v.series.map((s) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            fill={s.color}
            radius={s.radius}
            stackId={s.stackId}
            isAnimationActive={false}
            shape={s.activeIndex != null ? (props: any) => (
              <Rectangle
                {...props}
                {...(props.index === s.activeIndex
                  ? { fillOpacity: 0.8, stroke: props.payload.fill, strokeDasharray: s.activeStrokeDasharray, strokeDashoffset: 4 }
                  : {})}
              />
            ) : undefined}
          >
            {s.label && (Array.isArray(s.label) ? s.label : [s.label]).map((lc, li) => (
              <LabelList
                key={li}
                dataKey={lc.dataKey}
                position={lc.position ?? 'top'}
                offset={lc.offset}
                fontSize={lc.fontSize}
                fill={lc.fill}
                className={lc.className}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </div>
  );
}
