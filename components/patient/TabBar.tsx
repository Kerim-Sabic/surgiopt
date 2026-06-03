"use client";

import { motion } from "framer-motion";
import { Home, ListChecks, Activity, HeartPulse } from "lucide-react";
import { usePatient } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PatientTab } from "@/lib/types";

const PREHAB_TABS: { key: PatientTab; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "plan", label: "Plan", icon: ListChecks },
  { key: "physical", label: "Physical", icon: Activity },
  { key: "recovery", label: "Recovery", icon: HeartPulse },
];

const RECOVERY_TABS: { key: PatientTab; label: string; icon: typeof Home }[] = [
  { key: "recovery", label: "Recovery", icon: HeartPulse },
  { key: "physical", label: "Rehab", icon: Activity },
];

/** Floating frosted tab bar above the iOS home indicator. */
export function TabBar() {
  const { state, setTab } = usePatient();
  const tabs = state.phase === "recovery" ? RECOVERY_TABS : PREHAB_TABS;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 pb-2">
      <div className="pointer-events-auto mx-auto mb-1 flex w-fit items-center gap-1 rounded-full bg-white/70 px-1.5 py-1.5 shadow-glass backdrop-blur-xl ring-1 ring-white/60">
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = state.tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "press focus-ring relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight transition-colors",
                active ? "text-white" : "text-ink-muted hover:text-ink-soft",
              )}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-clinical-500 to-clinical-600 shadow-ring"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon className="relative z-10 h-[18px] w-[18px]" strokeWidth={2.4} />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>
      {/* Home indicator */}
      <div className="mx-auto h-1.5 w-32 rounded-full bg-ink/25" />
    </div>
  );
}
