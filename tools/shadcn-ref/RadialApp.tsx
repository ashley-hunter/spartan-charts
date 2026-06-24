import {
  Label,
  LabelList,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Tooltip,
} from 'recharts';

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
];

const stackedData = [{ month: 'january', mobile: 570, desktop: 1260 }];
const textData = [{ browser: 'safari', visitors: 200, fill: 'var(--chart-2)' }];
const shapeData = [{ browser: 'safari', visitors: 1260, fill: 'var(--chart-2)' }];

const LABELS: Record<string, string> = {
  chrome: 'Chrome',
  safari: 'Safari',
  firefox: 'Firefox',
  edge: 'Edge',
  other: 'Other',
};

function TooltipContent(props: any) {
  const { active, payload } = props;
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      {payload.map((item: any, i: number) => (
        <div className="tt-row tt-row-dot" key={i}>
          <div
            className="tt-ind tt-ind-dot"
            style={{ background: item.payload.fill ?? item.color }}
          />
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

export function RadialApp() {
  const p = new URLSearchParams(location.search);
  const w = Number(p.get('w')) || 600;
  const h = Number(p.get('h')) || 300;
  const variant = p.get('chart') ?? 'simple';

  const common = { width: w, height: h };

  if (variant === 'label') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadialBarChart
          {...common}
          data={chartData}
          startAngle={-90}
          endAngle={380}
          innerRadius={30}
          outerRadius={110}
        >
          <Tooltip cursor={false} content={<TooltipContent />} />
          <RadialBar dataKey="visitors" background isAnimationActive={false}>
            <LabelList
              position="insideStart"
              dataKey="browser"
              className="fill-white capitalize"
              fontSize={11}
            />
          </RadialBar>
        </RadialBarChart>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadialBarChart {...common} data={chartData} innerRadius={30} outerRadius={100}>
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarGrid gridType="circle" />
          <RadialBar dataKey="visitors" isAnimationActive={false} />
        </RadialBarChart>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadialBarChart
          {...common}
          data={textData}
          startAngle={0}
          endAngle={250}
          outerRadius={90}
          innerRadius={80}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[90, 80]}
          />
          <RadialBar dataKey="visitors" background cornerRadius={10} isAnimationActive={false} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }: any) =>
                viewBox && 'cx' in viewBox && 'cy' in viewBox ? (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="center-value-xl">
                      {textData[0].visitors.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="center-caption">
                      Visitors
                    </tspan>
                  </text>
                ) : null
              }
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </div>
    );
  }

  if (variant === 'stacked') {
    const total = stackedData[0].desktop + stackedData[0].mobile;
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadialBarChart
          {...common}
          data={stackedData}
          endAngle={180}
          innerRadius={80}
          outerRadius={110}
        >
          <RadialBar
            dataKey="mobile"
            fill="var(--chart-2)"
            stackId="a"
            cornerRadius={5}
            stroke="transparent"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <RadialBar
            dataKey="desktop"
            stackId="a"
            cornerRadius={5}
            fill="var(--chart-1)"
            stroke="transparent"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Tooltip cursor={false} content={<TooltipContent />} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }: any) =>
                viewBox && 'cx' in viewBox && 'cy' in viewBox ? (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="center-value"
                      style={{ fontSize: '1.5rem' }}
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="center-caption">
                      Visitors
                    </tspan>
                  </text>
                ) : null
              }
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </div>
    );
  }

  if (variant === 'shape') {
    return (
      <div className="chart" style={{ width: w, height: h }}>
        <RadialBarChart
          {...common}
          data={shapeData}
          endAngle={100}
          innerRadius={65}
          outerRadius={95}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[86, 74]}
          />
          <RadialBar dataKey="visitors" background isAnimationActive={false} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }: any) =>
                viewBox && 'cx' in viewBox && 'cy' in viewBox ? (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="center-value-xl">
                      {shapeData[0].visitors.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="center-caption">
                      Visitors
                    </tspan>
                  </text>
                ) : null
              }
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </div>
    );
  }

  // simple
  return (
    <div className="chart" style={{ width: w, height: h }}>
      <RadialBarChart {...common} data={chartData} innerRadius={30} outerRadius={110}>
        <Tooltip cursor={false} content={<TooltipContent />} />
        <RadialBar dataKey="visitors" background isAnimationActive={false} />
      </RadialBarChart>
    </div>
  );
}
