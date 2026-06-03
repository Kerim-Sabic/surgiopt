"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";

interface TrendChartProps {
  data: number[];
  color?: string;
}

interface Row {
  label: string;
  value: number;
}

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload as Row;
  return (
    <div className="rounded-xl bg-ink px-3 py-2 text-white shadow-lift">
      <p className="text-[11px] font-medium text-white/60">{row.label}</p>
      <p className="tnum text-sm font-bold">{row.value} readiness</p>
    </div>
  );
}

/** Readiness over the last 8 check-ins, with risk-stratification bands. */
export function TrendChart({ data, color = "#1F7C8E" }: TrendChartProps) {
  const rows: Row[] = data.map((value, i) => ({
    label: i === data.length - 1 ? "Today" : `${data.length - 1 - i}d ago`,
    value,
  }));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="readinessFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(14,27,42,0.06)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#9AA8B5", fontWeight: 600 }}
            dy={6}
            interval={1}
          />
          <YAxis
            domain={[30, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#9AA8B5" }}
            width={40}
            tickCount={5}
          />
          <ReferenceLine y={78} stroke="#34B97E" strokeDasharray="3 3" strokeOpacity={0.7} />
          <ReferenceLine y={58} stroke="#E8A53C" strokeDasharray="3 3" strokeOpacity={0.7} />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#readinessFill)"
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
