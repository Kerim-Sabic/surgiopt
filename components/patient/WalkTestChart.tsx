"use client";

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { WalkTestPoint } from "@/lib/types";

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload as WalkTestPoint;
  return (
    <div className="rounded-xl bg-ink px-3 py-2 text-white shadow-lift">
      <p className="text-[11px] font-medium text-white/60">{point.week}</p>
      <p className="tnum text-sm font-bold">
        {point.distance} m
        <span className="ml-1 text-[11px] font-medium text-white/50">
          / {point.target}
        </span>
      </p>
    </div>
  );
}

export function WalkTestChart({ data }: { data: WalkTestPoint[] }) {
  const target = data[0]?.target ?? 500;
  return (
    <div className="h-[168px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 6, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="walkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E9BD6" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#2E9BD6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#9AA8B5", fontWeight: 600 }}
            dy={6}
          />
          <YAxis
            domain={[300, 540]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#9AA8B5" }}
            width={42}
            tickCount={4}
          />
          <ReferenceLine
            y={target}
            stroke="#2FB37E"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Target ${target}m`,
              position: "insideTopRight",
              fontSize: 10,
              fill: "#1C8F62",
              fontWeight: 700,
            }}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "#2E9BD6", strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Area
            type="monotone"
            dataKey="distance"
            stroke="#2E9BD6"
            strokeWidth={2.5}
            fill="url(#walkFill)"
            dot={{ r: 3, fill: "#2E9BD6", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#1A77AE", stroke: "#fff", strokeWidth: 2 }}
            animationDuration={1100}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
