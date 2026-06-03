"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Shared layoutId so the pill animates between instances if needed. */
  layoutId?: string;
  size?: "sm" | "md";
  className?: string;
}

/** iOS-style segmented control with a spring-animated active pill. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId = "segment-pill",
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex rounded-full bg-ink/[0.06] p-1 ring-1 ring-ink/5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "press focus-ring relative rounded-full font-semibold tracking-tight transition-colors",
              size === "sm" ? "px-3.5 py-1.5 text-[13px]" : "px-5 py-2 text-sm",
              active ? "text-clinical-700" : "text-ink-muted hover:text-ink-soft",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-white shadow-glass-sm"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
