"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { TaskRow } from "../TaskRow";
import { ReadinessRing } from "@/components/ui/ReadinessRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { usePatient } from "@/lib/store";
import { PILLAR_META } from "@/lib/utils";
import type { PillarKey } from "@/lib/types";

const PILLARS: PillarKey[] = ["nutrition", "physical", "mental"];

export function DailyPlanScreen() {
  const { state, pillars, toggleTask } = usePatient();
  const done = state.tasks.filter((t) => t.done).length;
  const total = state.tasks.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-[#EEF2F5] pb-28">
      <StatusBar />

      <div className="px-5 pt-1">
        <h1 className="text-[22px] font-bold tracking-tight text-ink">
          Today&apos;s plan
        </h1>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          Each task you complete lifts a pillar. Watch them climb.
        </p>
      </div>

      {/* Progress header with live pillar rings */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-5 mt-4 rounded-4xl bg-white/65 p-4 shadow-glass backdrop-blur-xl ring-1 ring-white/60"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-attention/15 text-attention-deep">
              <Flame className="h-[18px] w-[18px]" />
            </span>
            <div>
              <p className="text-[13px] font-bold text-ink">
                {done} of {total} complete
              </p>
              <p className="text-[11px] text-ink-muted">
                {pct === 100 ? "Perfect day!" : `${pct}% of today`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {PILLARS.map((p) => (
              <div key={p} className="flex flex-col items-center">
                <ReadinessRing
                  value={pillars[p]}
                  size={48}
                  stroke={5.5}
                  color={PILLAR_META[p].hex}
                  colorTo={PILLAR_META[p].softHex}
                >
                  <AnimatedNumber
                    value={pillars[p]}
                    className="tnum text-[12px] font-bold tracking-tight text-ink"
                  />
                </ReadinessRing>
              </div>
            ))}
          </div>
        </div>
        {/* progress bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.07]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-clinical-500 to-ready"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </motion.div>

      {/* Tasks grouped by pillar */}
      <div className="mt-5 px-5">
        {PILLARS.map((pillar) => {
          const meta = PILLAR_META[pillar];
          const tasks = state.tasks.filter((t) => t.pillar === pillar);
          return (
            <section key={pillar} className="mb-5">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: meta.hex }}
                />
                <h2 className="text-[13px] font-bold tracking-tight text-ink">
                  {meta.shortLabel}
                </h2>
                <span className="ml-auto text-[11px] font-medium text-ink-faint">
                  {tasks.filter((t) => t.done).length}/{tasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {tasks.map((t, i) => (
                  <TaskRow key={t.id} task={t} onToggle={toggleTask} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
