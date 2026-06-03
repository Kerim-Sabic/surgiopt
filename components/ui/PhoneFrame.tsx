"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/** Realistic iPhone device frame: titanium bezel, dynamic island, home indicator. */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative w-[min(416px,calc(100vw-24px))] shrink-0 rounded-[clamp(2.75rem,12vw,3.5rem)] p-[clamp(10px,3vw,13px)]",
        "bg-gradient-to-b from-[#2a3340] via-[#11181f] to-[#0a0e13]",
        "shadow-device ring-1 ring-black/40",
        className,
      )}
    >
      {/* Outer titanium edge highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[3.5rem] ring-1 ring-inset ring-white/10" />

      {/* Side buttons */}
      <div className="absolute -left-[3px] top-[120px] h-9 w-[3px] rounded-l bg-[#1b222b]" />
      <div className="absolute -left-[3px] top-[172px] h-14 w-[3px] rounded-l bg-[#1b222b]" />
      <div className="absolute -left-[3px] top-[238px] h-14 w-[3px] rounded-l bg-[#1b222b]" />
      <div className="absolute -right-[3px] top-[196px] h-20 w-[3px] rounded-r bg-[#1b222b]" />

      {/* Screen */}
      <div className="relative h-[min(810px,calc((100vw-50px)*2.08))] w-full overflow-hidden rounded-[clamp(2.15rem,10vw,2.7rem)] bg-[#EEF2F5]">
        {/* Dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-[11px] z-50 h-[30px] w-[112px] -translate-x-1/2 rounded-full bg-black">
          <div className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0b0f14] ring-1 ring-white/10" />
        </div>
        {children}
      </div>
    </div>
  );
}
