"use client";

import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clamp } from "@/lib/utils";

interface ReadinessRingProps {
  value: number;
  size?: number;
  stroke?: number;
  color: string;
  colorTo?: string;
  trackColor?: string;
  delay?: number;
  children?: ReactNode;
  className?: string;
  rounded?: boolean;
}

/** Apple-Activity-style animated progress ring with a gradient stroke. */
export function ReadinessRing({
  value,
  size = 120,
  stroke = 12,
  color,
  colorTo,
  trackColor = "rgba(14,27,42,0.07)",
  delay = 0,
  children,
  className,
  rounded = true,
}: ReadinessRingProps) {
  const reduce = useReducedMotion();
  const gradId = useId();
  const v = clamp(value);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const target = circumference * (1 - v / 100);

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={colorTo ?? color} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap={rounded ? "round" : "butt"}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduce ? target : circumference }}
          animate={{ strokeDashoffset: target }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 70, damping: 18, delay }
          }
        />
      </svg>
      {children != null && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
