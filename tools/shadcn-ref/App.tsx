import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { INTERACTIVE_DATA } from './interactiveData';

const ICON_MAP: Record<string, any> = { desktop: TrendingDown, mobile: TrendingUp };

// "Apr 1" style date label (matches shadcn's toLocaleDateString usage).
const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const chartData = [
  { month: 'January', desktop: 186, mobile: 80, other: 45 },
  { month: 'February', desktop: 305, mobile: 200, other: 100 },
  { month: 'March', desktop: 237, mobile: 120, other: 150 },
  { month: 'April', desktop: 73, mobile: 190, other: 50 },
  { month: 'May', desktop: 209, mobile: 130, other: 100 },
  { month: 'June', desktop: 214, mobile: 140, other: 160 },
];

interface Series { dataKey: string; name: string; color: string; stackId?: string; fillOpacity?: number; gradient?: boolean }
interface Margin { top: number; right: number; bottom: number; left: number }
interface Variant { type: any; indicator: 'line' | 'dot'; hideLabel: boolean; series: Series[]; stackOffset?: any; legend?: boolean; icons?: boolean; yAxis?: boolean; margin?: Margin; interactive?: boolean }

const DESKTOP: Series = { dataKey: 'desktop', name: 'Desktop', color: 'var(--chart-1)' };
const MOBILE: Series = { dataKey: 'mobile', name: 'Mobile', color: 'var(--chart-2)' };
const OTHER: Series = { dataKey: 'other', name: 'Other', color: 'var(--chart-3)' };

const VARIANTS: Record<string, Variant> = {
  default: { type: 'natural', indicator: 'line', hideLabel: false, series: [DESKTOP] },
  linear: { type: 'linear', indicator: 'dot', hideLabel: true, series: [DESKTOP] },
  step: { type: 'step', indicator: 'dot', hideLabel: true, series: [DESKTOP] },
  stacked: {
    type: 'natural', indicator: 'dot', hideLabel: false,
    series: [{ ...MOBILE, stackId: 'a' }, { ...DESKTOP, stackId: 'a' }],
  },
  expand: {
    type: 'natural', indicator: 'line', hideLabel: false, stackOffset: 'expand',
    series: [
      { ...OTHER, stackId: 'a', fillOpacity: 0.1 },
      { ...MOBILE, stackId: 'a' },
      { ...DESKTOP, stackId: 'a' },
    ],
  },
  legend: {
    type: 'natural', indicator: 'line', hideLabel: false, legend: true,
    series: [{ ...MOBILE, stackId: 'a' }, { ...DESKTOP, stackId: 'a' }],
  },
  icons: {
    type: 'natural', indicator: 'line', hideLabel: false, legend: true, icons: true,
    series: [{ ...MOBILE, stackId: 'a' }, { ...DESKTOP, stackId: 'a' }],
  },
  gradient: {
    type: 'natural', indicator: 'dot', hideLabel: false,
    series: [{ ...MOBILE, stackId: 'a', gradient: true }, { ...DESKTOP, stackId: 'a', gradient: true }],
  },
  axes: {
    type: 'natural', indicator: 'dot', hideLabel: false, yAxis: true,
    margin: { top: 12, right: 12, bottom: 0, left: -20 },
    series: [{ ...MOBILE, stackId: 'a' }, { ...DESKTOP, stackId: 'a' }],
  },
  interactive: {
    type: 'natural', indicator: 'dot', hideLabel: false, interactive: true, legend: true,
    margin: { top: 12, right: 12, bottom: 0, left: 12 },
    series: [
      { ...MOBILE, stackId: 'a', gradient: true, fillOpacity: 1 },
      { ...DESKTOP, stackId: 'a', gradient: true, fillOpacity: 1 },
    ],
  },
};

// shadcn ChartLegendContent: centered row of swatch (or icon) + label below the chart.
function LegendContent({ payload, icons }: any) {
  if (!payload?.length) return null;
  return (
    <div className="spn-legend-row">
      {payload.map((item: any, i: number) => {
        const Icon = icons ? ICON_MAP[item.dataKey] : null;
        return (
          <div className="legend-item" key={i}>
            {Icon
              ? <span className="legend-icon"><Icon size={12} /></span>
              : <span className="swatch" style={{ background: item.color }} />}
            <span className="legend-label">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function makeTooltip(indicator: 'line' | 'dot', hideLabel: boolean, labelFormatter?: (l: any) => string) {
  return function TooltipContent(props: any) {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    const nestLabel = payload.length === 1 && indicator === 'line';
    const showTopLabel = !hideLabel && !nestLabel;
    const shownLabel = labelFormatter ? labelFormatter(label) : label;
    return (
      <div className="tt">
        {showTopLabel && <div className="tt-label">{shownLabel}</div>}
        {payload.map((item: any, i: number) => (
          <div className={`tt-row ${indicator === 'dot' ? 'tt-row-dot' : ''}`} key={i}>
            <div
              className={`tt-ind ${indicator === 'dot' ? 'tt-ind-dot' : ''}`}
              style={{ background: item.color }}
            />
            <div className={`tt-body ${nestLabel ? 'tt-nest' : ''}`}>
              <div className="tt-labels">
                {nestLabel && <span className="tt-label">{label}</span>}
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

export function App() {
  const p = new URLSearchParams(location.search);
  const w = Number(p.get('w')) || 600;
  const h = Number(p.get('h')) || 300;
  const v = VARIANTS[p.get('chart') ?? 'default'] ?? VARIANTS.default;
  const TooltipContent = makeTooltip(v.indicator, v.hideLabel, v.interactive ? fmtDate : undefined);
  const data = v.interactive ? INTERACTIVE_DATA : chartData;

  return (
    <div className="chart" style={{ width: w, height: h }}>
      <AreaChart
        width={w}
        height={h}
        data={data}
        margin={v.margin ?? { top: 12, right: 12, bottom: 0, left: 12 }}
        stackOffset={v.stackOffset}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={v.interactive ? 'date' : 'month'}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={v.interactive ? 32 : undefined}
          tickFormatter={v.interactive ? fmtDate : (value: string) => value.slice(0, 3)}
        />
        {v.yAxis && (
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
        )}
        <Tooltip cursor={false} content={<TooltipContent />} />
        {v.legend && <Legend content={(props: any) => <LegendContent {...props} icons={v.icons} />} />}
        <defs>
          {v.series.filter((s) => s.gradient).map((s) => (
            <linearGradient key={s.dataKey} id={`fill-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        {v.series.map((s) => (
          <Area
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            type={v.type}
            fill={s.gradient ? `url(#fill-${s.dataKey})` : s.color}
            fillOpacity={s.fillOpacity ?? 0.4}
            stroke={s.color}
            stackId={s.stackId}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </div>
  );
}
