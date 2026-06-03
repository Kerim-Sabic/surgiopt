"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  icon?: ReactNode;
  hint?: string;
  accent?: string;
  className?: string;
}

/** Compact clinical stat tile with a large readable number. */
export function MetricCard({
  label,
  value,
  unit,
  icon,
  hint,
  accent,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "glass card-sheen rounded-3xl p-4 shadow-glass-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          {label}
        </span>
        {icon && (
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={accent ? { color: accent, background: `${accent}1a` } : undefined}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="tnum text-[26px] font-bold leading-none tracking-tight text-ink">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-ink-faint">{unit}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
