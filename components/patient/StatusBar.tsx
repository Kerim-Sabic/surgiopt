"use client";

import { Signal, Wifi, BatteryFull } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  /** Use light glyphs on dark screens. */
  dark?: boolean;
}

/** iOS-style status bar. Static 9:41 — the canonical Apple keynote time. */
export function StatusBar({ dark = false }: StatusBarProps) {
  const tone = dark ? "text-white" : "text-ink";
  return (
    <div
      className={cn(
        "relative z-40 flex h-[54px] items-end justify-between px-7 pb-1.5 text-[15px] font-semibold",
        tone,
      )}
    >
      <span className="tnum tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-[15px] w-[15px]" strokeWidth={2.5} />
        <Wifi className="h-[15px] w-[15px]" strokeWidth={2.5} />
        <BatteryFull className="h-[19px] w-[19px]" strokeWidth={2} />
      </div>
    </div>
  );
}
