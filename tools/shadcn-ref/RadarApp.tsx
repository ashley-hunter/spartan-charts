import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Tooltip,
} from 'recharts';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';

const defaultData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 273 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const linesOnlyData = [
  { month: 'January', desktop: 186, mobile: 160 },
  { month: 'February', desktop: 185, mobile: 170 },
  { month: 'March', desktop: 207, mobile: 180 },
  { month: 'April', desktop: 173, mobile: 160 },
  { month: 'May', desktop: 160, mobile: 190 },
  { month: 'June', desktop: 174, mobile: 204 },
];

const multipleData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const gridFillData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 285 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 203 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 264 },
];

const gridCircleNoLinesData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 203 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const LABELS: Record<string, string> = { desktop: 'Desktop', mobile: 'Mobile' };

function TooltipContent(props: any) {
  const { active, payload, label } = props;
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      {label !== undefined && <div className="tt-label">{label}</div>}
      {payload.map((item: any, i: number) => (
        <div className="tt-row" key={i}>
          <div className="tt-ind" style={{ background: item.color }} />
          <div className="tt-body">
            <div className="tt-labels">
              <span className="tt-name">{LABELS[item.name] ?? item.name}</span>
            </div>
            <span className="tt-value">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RadarApp() {
  const p = new URLSearchParams(location.search);
  const w = Number(p.get('w')) || 600;
  const h = Number(p.get('h')) || 300;
  const variant = p.get('chart') ?? 'default';
  const common = { width: w, height: h };

  if (variant === 'lines-only') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={linesOnlyData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid radialLines={false} />
          <Radar
            dataKey="desktop"
            fill="var(--chart-1)"
            fillOpacity={0}
            stroke="var(--chart-1)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Radar
            dataKey="mobile"
            fill="var(--chart-2)"
            fillOpacity={0}
            stroke="var(--chart-2)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={defaultData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid />
          <Radar
            dataKey="desktop"
            fill="var(--chart-1)"
            fillOpacity={0.6}
            dot={{ r: 4, fillOpacity: 1 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'multiple') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={multipleData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid />
          <Radar dataKey="desktop" fill="var(--chart-1)" fillOpacity={0.6} isAnimationActive={false} />
          <Radar dataKey="mobile" fill="var(--chart-2)" isAnimationActive={false} />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'legend') {
    const legendH = 52;
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart
          {...common}
          height={h - legendH}
          data={multipleData}
          margin={{ top: -40, bottom: -10, left: 0, right: 0 }}
        >
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid />
          <Radar dataKey="desktop" fill="var(--chart-1)" fillOpacity={0.6} isAnimationActive={false} />
          <Radar dataKey="mobile" fill="var(--chart-2)" isAnimationActive={false} />
        </RadarChart>
        <div className="spn-legend-row" style={{ marginTop: '2rem' }}>
          <div className="legend-item">
            <span className="swatch" style={{ background: 'var(--chart-1)' }} />
            <span className="legend-label">Desktop</span>
          </div>
          <div className="legend-item">
            <span className="swatch" style={{ background: 'var(--chart-2)' }} />
            <span className="legend-label">Mobile</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'grid-circle') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={defaultData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarGrid gridType="circle" />
          <PolarAngleAxis dataKey="month" />
          <Radar
            dataKey="desktop"
            fill="var(--chart-1)"
            fillOpacity={0.6}
            dot={{ r: 4, fillOpacity: 1 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'label-custom') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={multipleData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarAngleAxis
            dataKey="month"
            tick={({ x, y, textAnchor, index, ...props }: any) => {
              const data = multipleData[index];
              const yValue = typeof y === 'number' ? y : 0;
              return (
                <text
                  x={x}
                  y={yValue + (index === 0 ? -10 : 0)}
                  textAnchor={textAnchor}
                  fontSize={13}
                  fontWeight={500}
                  fill="hsl(var(--foreground))"
                  {...props}
                >
                  <tspan>{data.desktop}</tspan>
                  <tspan className="fill-muted-foreground">/</tspan>
                  <tspan>{data.mobile}</tspan>
                  <tspan x={x} dy="1rem" fontSize={12} className="fill-muted-foreground">
                    {data.month}
                  </tspan>
                </text>
              );
            }}
          />
          <PolarGrid />
          <Radar dataKey="desktop" fill="var(--chart-1)" fillOpacity={0.6} isAnimationActive={false} />
          <Radar dataKey="mobile" fill="var(--chart-2)" isAnimationActive={false} />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'grid-none') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={defaultData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <Radar
            dataKey="desktop"
            fill="var(--chart-1)"
            fillOpacity={0.6}
            dot={{ r: 4, fillOpacity: 1 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'grid-fill') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={gridFillData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarGrid fill="var(--chart-1)" fillOpacity={0.2} />
          <PolarAngleAxis dataKey="month" />
          <Radar dataKey="desktop" fill="var(--chart-1)" fillOpacity={0.5} isAnimationActive={false} />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'grid-custom') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={defaultData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarGrid radialLines={false} polarRadius={[90]} strokeWidth={1} />
          <PolarAngleAxis dataKey="month" />
          <Radar dataKey="desktop" fill="var(--chart-1)" fillOpacity={0.6} isAnimationActive={false} />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'grid-circle-no-lines') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={gridCircleNoLinesData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarGrid gridType="circle" radialLines={false} />
          <PolarAngleAxis dataKey="month" />
          <Radar
            dataKey="desktop"
            fill="var(--chart-1)"
            fillOpacity={0.6}
            dot={{ r: 4, fillOpacity: 1 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </div>
    );
  }

  if (variant === 'icons') {
    const legendH = 52;
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart
          {...common}
          height={h - legendH}
          data={multipleData}
          margin={{ top: -40, bottom: -10, left: 0, right: 0 }}
        >
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid />
          <Radar dataKey="desktop" fill="var(--chart-1)" fillOpacity={0.6} isAnimationActive={false} />
          <Radar dataKey="mobile" fill="var(--chart-2)" isAnimationActive={false} />
        </RadarChart>
        <div className="spn-legend-row" style={{ marginTop: '2rem' }}>
          <div className="legend-item">
            <ArrowDownFromLine width={12} height={12} className="legend-icon" />
            <span className="legend-label">Desktop</span>
          </div>
          <div className="legend-item">
            <ArrowUpFromLine width={12} height={12} className="legend-icon" />
            <span className="legend-label">Mobile</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'radius') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadarChart {...common} data={multipleData}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarGrid />
          <Radar dataKey="desktop" fill="var(--chart-1)" fillOpacity={0.6} isAnimationActive={false} />
          <Radar dataKey="mobile" fill="var(--chart-2)" isAnimationActive={false} />
          <PolarRadiusAxis angle={60} stroke="hsl(var(--foreground))" orientation="middle" axisLine={false} />
        </RadarChart>
      </div>
    );
  }

  // default
  return (
    <div className="chart" style={{ width: w, height: h }}>
      <RadarChart {...common} data={defaultData}>
        <Tooltip cursor={false} content={<TooltipContent />} />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--chart-1)" fillOpacity={0.6} isAnimationActive={false} />
      </RadarChart>
    </div>
  );
}
