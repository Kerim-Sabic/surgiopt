"use client";

import { motion } from "framer-motion";
import { CalendarClock, ArrowRight, TrendingUp } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { TaskRow } from "../TaskRow";
import { ReadinessRing } from "@/components/ui/ReadinessRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PillarCard } from "@/components/ui/PillarCard";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { usePatient } from "@/lib/store";
import { PATIENT_PROFILE } from "@/lib/mock-data";
import { avatarGradient, initials } from "@/lib/utils";
import type { PillarKey } from "@/lib/types";

export function HomeScreen() {
  const { pillars, readiness, risk, state, toggleTask, earnedPoints, setTab } =
    usePatient();

  const doneCount = state.tasks.filter((t) => t.done).length;
  const previewTasks = state.tasks.filter((t) => !t.done).slice(0, 3);
  const pillarOrder: PillarKey[] = ["nutrition", "physical", "mental"];

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-[#EEF2F5] pb-28">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-1">
        <div>
          <p className="text-[13px] font-medium text-ink-muted">
            Good morning
          </p>
          <h1 className="text-[22px] font-bold tracking-tight text-ink">
            {PATIENT_PROFILE.firstName}
          </h1>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-glass-sm ring-2 ring-white"
          style={{ background: avatarGradient(320) }}
        >
          {initials(PATIENT_PROFILE.fullName)}
        </div>
      </div>

      {/* Countdown chip */}
      <div className="mt-4 px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-clinical-500/10 px-3.5 py-2.5 ring-1 ring-clinical-500/15">
          <CalendarClock className="h-4 w-4 text-clinical-600" />
          <span className="text-[13px] font-semibold text-clinical-700">
            {PATIENT_PROFILE.daysToSurgery} days to surgery
          </span>
          <span className="text-[12px] text-clinical-600/70">
            · {PATIENT_PROFILE.procedure}
          </span>
        </div>
      </div>

      {/* Hero readiness */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-5 mt-4 overflow-hidden rounded-4xl bg-gradient-to-br from-clinical-600 to-clinical-800 p-5 shadow-ring"
      >
        <div className="flex items-center gap-5">
          <ReadinessRing
            value={readiness}
            size={118}
            stroke={11}
            color="#7FE3C0"
            colorTo="#34B97E"
            trackColor="rgba(255,255,255,0.16)"
          >
            <div className="flex flex-col items-center">
              <AnimatedNumber
                value={readiness}
                className="tnum text-[34px] font-bold leading-none tracking-tighter text-white"
              />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-clinical-200">
                / 100
              </span>
            </div>
          </ReadinessRing>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-clinical-200">
              Surgical Readiness
            </p>
            <div className="mt-1.5">
              <RiskBadge risk={risk} />
            </div>
            <p className="mt-2.5 text-[13px] leading-snug text-clinical-100">
              {risk === "low"
                ? "You're in great shape for surgery. Keep it up."
                : risk === "moderate"
                  ? "Solid progress — a few more wins move you to low-risk."
                  : "Let's focus on today's plan to build your reserve."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pillars */}
      <div className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold tracking-tight text-ink">
            Your three pillars
          </h2>
          <span className="flex items-center gap-1 text-[12px] font-semibold text-ready-deep">
            <TrendingUp className="h-3.5 w-3.5" />
            improving
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {pillarOrder.map((p, i) => (
            <PillarCard
              key={p}
              pillar={p}
              score={pillars[p]}
              earned={earnedPoints(p)}
              index={i}
              onClick={p === "physical" ? () => setTab("physical") : undefined}
            />
          ))}
        </div>
      </div>

      {/* Today's plan preview */}
      <div className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold tracking-tight text-ink">
            Today&apos;s plan
          </h2>
          <span className="text-[12px] font-semibold text-ink-muted">
            {doneCount}/{state.tasks.length} done
          </span>
        </div>
        <div className="space-y-2">
          {previewTasks.length > 0 ? (
            previewTasks.map((t, i) => (
              <TaskRow key={t.id} task={t} onToggle={toggleTask} index={i} />
            ))
          ) : (
            <div className="glass rounded-3xl p-5 text-center shadow-glass-sm">
              <p className="text-sm font-semibold text-ready-deep">
                All done for today 🎉
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Beautiful work — your rings reflect it.
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setTab("plan")}
          className="press focus-ring mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-white/60 py-3 text-[14px] font-semibold text-clinical-700 shadow-glass-sm"
        >
          View full plan
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
