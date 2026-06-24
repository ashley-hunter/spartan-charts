import { Cell, Label, LabelList, Legend, Pie, PieChart, Sector, Tooltip } from 'recharts';

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
];

const donutTextData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 190, fill: 'var(--chart-5)' },
];

const desktopData = [
  { month: 'january', desktop: 186, fill: 'var(--chart-1)' },
  { month: 'february', desktop: 305, fill: 'var(--chart-2)' },
  { month: 'march', desktop: 237, fill: 'var(--chart-3)' },
  { month: 'april', desktop: 173, fill: 'var(--chart-4)' },
  { month: 'may', desktop: 209, fill: 'var(--chart-5)' },
];

const mobileData = [
  { month: 'january', mobile: 80, fill: 'var(--chart-1)' },
  { month: 'february', mobile: 200, fill: 'var(--chart-2)' },
  { month: 'march', mobile: 120, fill: 'var(--chart-3)' },
  { month: 'april', mobile: 190, fill: 'var(--chart-4)' },
  { month: 'may', mobile: 130, fill: 'var(--chart-5)' },
];

const LABELS: Record<string, string> = {
  chrome: 'Chrome',
  safari: 'Safari',
  firefox: 'Firefox',
  edge: 'Edge',
  other: 'Other',
};

interface Variant {
  innerRadius?: number;
  label?: boolean | 'list' | 'custom';
  legend?: boolean;
  centerText?: boolean;
  active?: 'simple' | 'ring';
  stacked?: boolean;
  data?: typeof chartData | typeof desktopData;
  dataKey?: string;
  nameKey?: string;
  stroke?: string;
  strokeWidth?: number;
}

const VARIANTS: Record<string, Variant> = {
  simple: {},
  donut: { innerRadius: 60 },
  'donut-text': { innerRadius: 60, centerText: true, data: donutTextData, strokeWidth: 5 },
  label: { label: true },
  legend: { legend: true },
  stacked: { stacked: true },
  'donut-active': { innerRadius: 60, strokeWidth: 5, active: 'simple' },
  'label-list': { label: 'list' },
  'label-custom': { label: 'custom' },
  'separator-none': { stroke: '0' },
  interactive: {
    data: desktopData,
    dataKey: 'desktop',
    nameKey: 'month',
    innerRadius: 60,
    strokeWidth: 5,
    active: 'ring',
    centerText: true,
  },
};

function TooltipContent(props: any) {
  const { active, payload } = props;
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      {payload.map((item: any, i: number) => (
        <div className="tt-row tt-row-dot" key={i}>
          <div className="tt-ind tt-ind-dot" style={{ background: item.payload.fill }} />
          <div className="tt-body">
            <div className="tt-labels"><span className="tt-name">{LABELS[item.name] ?? item.name}</span></div>
            <span className="tt-value">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LegendContent() {
  return (
    <div className="spn-legend-row pie-legend">
      {chartData.map((item) => (
        <div className="legend-item" key={item.browser}>
          <span className="swatch" style={{ background: item.fill }} />
          <span className="legend-label">{LABELS[item.browser]}</span>
        </div>
      ))}
    </div>
  );
}

export function PieApp() {
  const p = new URLSearchParams(location.search);
  const w = Number(p.get('w')) || 600;
  const h = Number(p.get('h')) || 300;
  const v = VARIANTS[p.get('chart') ?? 'simple'] ?? VARIANTS.simple;
  const chartHeight = h - (v.legend ? 36 : 0);
  const data = v.data ?? chartData;
  const dataKey = v.dataKey ?? 'visitors';
  const nameKey = v.nameKey ?? 'browser';
  const totalVisitors = data.reduce((total, item: any) => total + item[dataKey], 0);
  const activeIndex = 0;
  const centerValue = v.active === 'ring' ? (data[activeIndex] as any)[dataKey] : totalVisitors;

  return (
    <div className="chart" style={{ width: w, height: h }}>
      <PieChart width={w} height={chartHeight}>
        {!v.legend && <Tooltip cursor={false} content={<TooltipContent />} />}
        {v.stacked ? (
          <>
            <Pie data={desktopData} dataKey="desktop" outerRadius={60} isAnimationActive={false}>
              {desktopData.map((item) => <Cell key={item.month} fill={item.fill} stroke="hsl(var(--background))" strokeWidth={1} />)}
            </Pie>
            <Pie data={mobileData} dataKey="mobile" innerRadius={70} outerRadius={90} isAnimationActive={false}>
              {mobileData.map((item) => <Cell key={item.month} fill={item.fill} stroke="hsl(var(--background))" strokeWidth={1} />)}
            </Pie>
          </>
        ) : (
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={v.innerRadius}
            outerRadius="80%"
            stroke={v.stroke}
            strokeWidth={v.strokeWidth ?? 1}
            label={
              v.label === true
                ? ({ payload }: any) => LABELS[payload.browser] ?? payload.browser
                : v.label === 'custom'
                  ? ({ payload, ...props }: any) => (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="var(--foreground)"
                    >
                      {payload.visitors}
                    </text>
                  )
                  : false
            }
            labelLine={v.label === 'custom' ? false : undefined}
            shape={
              v.active
                ? ({ index, outerRadius = 0, ...props }: any) =>
                  index === activeIndex ? (
                    v.active === 'ring' ? (
                      <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                      </g>
                    ) : (
                      <Sector {...props} outerRadius={outerRadius + 10} />
                    )
                  ) : (
                    <Sector {...props} outerRadius={outerRadius} />
                  )
                : undefined
            }
            isAnimationActive={false}
          >
            {data.map((item: any) => (
              <Cell key={item[nameKey]} fill={item.fill} stroke={v.stroke ?? 'hsl(var(--background))'} strokeWidth={v.strokeWidth ?? 1} />
            ))}
            {v.label === 'list' && (
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) => LABELS[value] ?? value}
              />
            )}
            {v.centerText && (
              <Label
                content={({ viewBox }: any) => viewBox && 'cx' in viewBox && 'cy' in viewBox ? (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="center-value">{centerValue.toLocaleString()}</tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="center-caption">Visitors</tspan>
                  </text>
                ) : null}
              />
            )}
          </Pie>
        )}
        {v.legend && <Legend content={<LegendContent />} />}
      </PieChart>
    </div>
  );
}
