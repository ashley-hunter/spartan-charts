import { CartesianGrid, LabelList, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
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

interface Series { dataKey: string; name: string; color: string; dot?: boolean; activeDot?: { r: number } }
interface Margin { top: number; right: number; bottom: number; left: number }
interface Variant {
  type: any;
  hideLabel: boolean;
  series: Series[];
  margin?: Margin;
  labels?: boolean;
  dataset?: 'browser' | 'interactive';
  categoryKey?: string;
  dateAxis?: boolean;
  hideCategoryAxis?: boolean;
  indicator?: 'dot' | 'line';
  labelDataKey?: string;
}

const DESKTOP: Series = { dataKey: 'desktop', name: 'Desktop', color: 'var(--chart-1)' };
const MOBILE: Series = { dataKey: 'mobile', name: 'Mobile', color: 'var(--chart-2)' };
const VISITORS: Series = { dataKey: 'visitors', name: 'Visitors', color: 'var(--chart-2)' };

const VARIANTS: Record<string, Variant> = {
  default: { type: 'natural', hideLabel: true, series: [DESKTOP] },
  linear: { type: 'linear', hideLabel: true, series: [DESKTOP] },
  multiple: { type: 'monotone', hideLabel: false, series: [DESKTOP, MOBILE] },
  dots: {
    type: 'natural',
    hideLabel: true,
    series: [{ ...DESKTOP, dot: true, activeDot: { r: 6 } }],
  },
  label: {
    type: 'natural',
    hideLabel: false,
    labels: true,
    margin: { top: 20, right: 12, bottom: 0, left: 12 },
    series: [{ ...DESKTOP, dot: true, activeDot: { r: 6 } }],
  },
  step: { type: 'step', hideLabel: true, series: [DESKTOP] },
  interactive: {
    type: 'natural',
    hideLabel: false,
    dataset: 'interactive',
    categoryKey: 'date',
    dateAxis: true,
    series: [DESKTOP],
  },
  'custom-label': {
    type: 'natural',
    hideLabel: true,
    labels: true,
    dataset: 'browser',
    categoryKey: 'browser',
    hideCategoryAxis: true,
    indicator: 'line',
    labelDataKey: 'browser',
    margin: { top: 24, right: 24, bottom: 12, left: 24 },
    series: [{ ...VISITORS, dot: true, activeDot: { r: 6 } }],
  },
};

function makeTooltip(hideLabel: boolean, indicator: 'dot' | 'line', labelFormatter?: (l: any) => string) {
  return function TooltipContent(props: any) {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    const shownLabel = labelFormatter ? labelFormatter(label) : label;
    return (
      <div className="tt">
        {!hideLabel && <div className="tt-label">{shownLabel}</div>}
        {payload.map((item: any, i: number) => (
          <div className={`tt-row ${indicator === 'dot' ? 'tt-row-dot' : ''}`} key={i}>
            <div className={`tt-ind tt-ind-${indicator}`} style={{ background: item.color }} />
            <div className="tt-body">
              <div className="tt-labels"><span className="tt-name">{item.name}</span></div>
              <span className="tt-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
}

export function LineApp() {
  const p = new URLSearchParams(location.search);
  const w = Number(p.get('w')) || 600;
  const h = Number(p.get('h')) || 300;
  const v = VARIANTS[p.get('chart') ?? 'default'] ?? VARIANTS.default;
  const TooltipContent = makeTooltip(v.hideLabel, v.indicator ?? 'dot', v.dateAxis ? fmtDate : undefined);
  const data: any[] = v.dataset === 'browser' ? browserData
    : v.dataset === 'interactive' ? INTERACTIVE_DATA
    : chartData;
  const categoryKey = v.categoryKey ?? 'month';
  const fmtCat = (value: string) =>
    v.dataset === 'interactive' ? fmtDate(value) : value.slice(0, 3);
  const fmtLabel = (value: string) =>
    v.labelDataKey === 'browser' ? (BROWSER_LABELS[value] ?? value) : value;

  return (
    <div className="chart" style={{ width: w, height: h }}>
      <LineChart
        width={w}
        height={h}
        data={data}
        margin={v.margin ?? { top: 12, right: 12, bottom: 0, left: 12 }}
      >
        <CartesianGrid vertical={false} />
        {!v.hideCategoryAxis && (
          <XAxis
            dataKey={categoryKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={v.dateAxis ? 32 : undefined}
            tickFormatter={fmtCat}
          />
        )}
        <YAxis hide />
        <Tooltip cursor={false} content={<TooltipContent />} />
        {v.series.map((s) => (
          <Line
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            type={v.type}
            stroke={s.color}
            strokeWidth={2}
            dot={s.dot ? { fill: s.color, stroke: 'transparent', strokeWidth: 0 } : false}
            activeDot={s.activeDot ?? { r: 4, fill: s.color, stroke: 'transparent', strokeWidth: 0 }}
            isAnimationActive={false}
          >
            {v.labels && (
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey={v.labelDataKey}
                formatter={fmtLabel}
              />
            )}
          </Line>
        ))}
      </LineChart>
    </div>
  );
}
