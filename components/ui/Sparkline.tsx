"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color: string;
  className?: string;
}

/** Lightweight animated SVG sparkline with a soft area fill. */
export function Sparkline({
  data,
  width = 96,
  height = 32,
  color,
  className,
}: SparklineProps) {
  const reduce = useReducedMotion();
  const gradId = useId();
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const innerH = height - pad * 2;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = pad + innerH - ((d - min) / span) * innerH;
    return [x, y] as const;
  });

  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} ${width},${height} 0,${height}`;
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <motion.polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={reduce ? undefined : { pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.circle
        cx={lastX}
        cy={lastY}
        r={2.6}
        fill={color}
        initial={reduce ? false : { scale: 0 }}
        animate={reduce ? undefined : { scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 400, damping: 18 }}
      />
    </svg>
  );
}
