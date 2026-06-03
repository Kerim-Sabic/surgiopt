"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronLeft, TrendingUp, Dumbbell, Timer } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { WalkTestChart } from "../WalkTestChart";
import { ReadinessRing } from "@/components/ui/ReadinessRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { usePatient } from "@/lib/store";
import {
  WALK_TEST_TREND,
  EXERCISE_OF_THE_DAY,
  WEEKLY_PHYSICAL,
} from "@/lib/mock-data";
import { PILLAR_META } from "@/lib/utils";

export function PhysicalPillarScreen() {
  const { pillars, earnedPoints, setTab, state } = usePatient();
  const [playing, setPlaying] = useState(false);
  const meta = PILLAR_META.physical;

  const latest = WALK_TEST_TREND[WALK_TEST_TREND.length - 1].distance;
  const first = WALK_TEST_TREND[0].distance;
  const gain = latest - first;
  const earned = earnedPoints("physical");

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-[#EEF2F5] pb-28">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-1">
        {state.phase === "prehab" && (
          <button
            onClick={() => setTab("home")}
            className="press focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-ink-soft shadow-glass-sm"
            aria-label="Back to home"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-ink">
            Physical Prehab
          </h1>
          <p className="text-[12px] font-medium text-physical-deep">{meta.description}</p>
        </div>
      </div>

      {/* Score + 6MWT headline */}
      <div className="mx-4 mt-4 flex items-center gap-4 rounded-4xl bg-white/65 p-4 shadow-glass backdrop-blur-xl ring-1 ring-white/60">
        <ReadinessRing
          value={pillars.physical}
          size={94}
          stroke={9}
          color={meta.hex}
          colorTo={meta.softHex}
        >
          <div className="flex flex-col items-center">
            <AnimatedNumber
              value={pillars.physical}
              className="tnum text-2xl font-bold tracking-tight text-ink"
            />
            {earned > 0 && (
              <span className="text-[10px] font-bold text-physical-deep">
                +{earned} today
              </span>
            )}
          </div>
        </ReadinessRing>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            6-Min Walk Test
          </p>
          <div className="mt-0.5 flex items-baseline gap-1">
            <AnimatedNumber
              value={latest}
              className="tnum text-3xl font-bold tracking-tight text-ink"
            />
            <span className="text-sm font-semibold text-ink-faint">m</span>
          </div>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-ready-soft px-2 py-0.5 text-[11px] font-bold text-ready-deep">
            <TrendingUp className="h-3 w-3" />+{gain} m in 6 weeks
          </span>
        </div>
      </div>

      {/* Trend chart */}
      <div className="mx-4 mt-4 rounded-4xl bg-white/65 p-4 pt-3 shadow-glass backdrop-blur-xl ring-1 ring-white/60">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[14px] font-bold tracking-tight text-ink">
            Walk-test progress
          </h2>
          <span className="text-[11px] font-medium text-ink-faint">metres</span>
        </div>
        <WalkTestChart data={WALK_TEST_TREND} />
      </div>

      {/* Exercise of the day */}
      <div className="mx-4 mt-4 overflow-hidden rounded-4xl bg-gradient-to-br from-physical-deep to-clinical-800 p-4 shadow-ring">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-physical-soft">
            <Dumbbell className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wide">
              Exercise of the day
            </span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">
            <Timer className="h-3 w-3" />
            {EXERCISE_OF_THE_DAY.duration}
          </span>
        </div>
        <p className="mt-2 text-[17px] font-bold tracking-tight text-white">
          {EXERCISE_OF_THE_DAY.title}
        </p>
        <p className="text-[12px] text-physical-soft">{EXERCISE_OF_THE_DAY.focus}</p>

        <button
          onClick={() => setPlaying((p) => !p)}
          className="press focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[14px] font-bold text-physical-deep shadow-lift"
        >
          {playing ? (
            <>
              <Pause className="h-4 w-4 fill-current" /> Pause session
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" /> Start session
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {playing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-1.5 border-t border-white/15 pt-3">
                {EXERCISE_OF_THE_DAY.blocks.map((b, i) => (
                  <motion.div
                    key={b.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center justify-between text-[13px]"
                  >
                    <span className="flex items-center gap-2 font-semibold text-white">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold">
                        {i + 1}
                      </span>
                      {b.name}
                    </span>
                    <span className="text-physical-soft">{b.detail}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Weekly activity */}
      <div className="mx-4 mt-4 rounded-4xl bg-white/65 p-4 shadow-glass backdrop-blur-xl ring-1 ring-white/60">
        <h2 className="text-[14px] font-bold tracking-tight text-ink">
          This week&apos;s activity
        </h2>
        <div className="mt-3 flex items-end justify-between gap-2" style={{ height: 96 }}>
          {WEEKLY_PHYSICAL.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-[72px] w-full items-end justify-center">
                <motion.div
                  className="w-full max-w-[22px] rounded-full"
                  style={{
                    background:
                      d.value >= 80
                        ? "linear-gradient(180deg,#2E9BD6,#1A77AE)"
                        : d.value > 0
                          ? "#9FCDE8"
                          : "rgba(14,27,42,0.06)",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(d.value, 6)}%` }}
                  transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 120, damping: 16 }}
                />
              </div>
              <span className="text-[11px] font-semibold text-ink-faint">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
