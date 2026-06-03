"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Stethoscope,
} from "lucide-react";
import { StatusBar } from "../StatusBar";
import { taskIcon } from "@/components/ui/icons";
import { usePatient } from "@/lib/store";
import {
  RECOVERY_SYMPTOMS,
  PATIENT_PROFILE,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PAIN_COLORS = ["#34B97E", "#7ABF55", "#A9C24A", "#E8A53C", "#E8843C", "#E26A5E"];
function painColor(p: number): string {
  return PAIN_COLORS[Math.min(PAIN_COLORS.length - 1, Math.floor(p / 2))];
}

export function RecoveryScreen() {
  const {
    state,
    phase,
    recoveryStatus,
    togglePhase,
    setPain,
    toggleSymptom,
    toggleRehab,
  } = usePatient();
  const isRecovery = phase === "recovery";
  const flagged = recoveryStatus === "flag";
  const rehabDone = state.rehab.filter((r) => r.done).length;

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-[#EEF2F5] pb-28">
      <StatusBar />

      <div className="px-5 pt-1">
        <h1 className="text-[22px] font-bold tracking-tight text-ink">Recovery</h1>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          {isRecovery
            ? "Post-op day 2 · Laparoscopic Cholecystectomy"
            : `Activates on surgery day · in ${PATIENT_PROFILE.daysToSurgery} days`}
        </p>
      </div>

      {/* Phase toggle */}
      <div className="mx-5 mt-4 flex items-center justify-between rounded-3xl bg-white/65 p-4 shadow-glass-sm ring-1 ring-white/60">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl transition-colors",
              isRecovery ? "bg-mental/15 text-mental-deep" : "bg-ink/[0.06] text-ink-muted",
            )}
          >
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[14px] font-bold tracking-tight text-ink">
              Post-op recovery mode
            </p>
            <p className="text-[12px] text-ink-muted">
              {isRecovery ? "On — app is in recovery" : "Flip the whole app to post-op"}
            </p>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={isRecovery}
          onClick={togglePhase}
          className={cn(
            "focus-ring relative h-8 w-[54px] shrink-0 rounded-full transition-colors",
            isRecovery ? "bg-clinical-500" : "bg-ink/15",
          )}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className={cn(
              "absolute top-1 h-6 w-6 rounded-full bg-white shadow",
              isRecovery ? "left-[26px]" : "left-1",
            )}
          />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isRecovery ? (
          <motion.div
            key="recovery-body"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status hero */}
            <div className="mx-5 mt-4">
              <motion.div
                layout
                className={cn(
                  "overflow-hidden rounded-4xl p-5 shadow-glass",
                  flagged
                    ? "bg-gradient-to-br from-attention to-risk"
                    : "bg-gradient-to-br from-ready to-nutrition-deep",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                    {flagged ? (
                      <AlertTriangle className="h-7 w-7 text-white" />
                    ) : (
                      <CheckCircle2 className="h-7 w-7 text-white" />
                    )}
                  </span>
                  <div>
                    <p className="text-[19px] font-bold tracking-tight text-white">
                      {flagged ? "Flagged for review" : "Recovery on track"}
                    </p>
                    <p className="text-[13px] text-white/85">
                      {flagged
                        ? "Your care team has been notified."
                        : "Your check-ins look healthy. Keep going."}
                    </p>
                  </div>
                </div>
                <AnimatePresence>
                  {flagged && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex items-start gap-2 rounded-2xl bg-white/15 p-3"
                    >
                      <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      <p className="text-[12px] leading-snug text-white">
                        A clinician will review your symptoms and contact you. This
                        is decision support — no action is taken automatically.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Daily check-in: pain */}
            <div className="mx-5 mt-4 rounded-4xl bg-white/65 p-4 shadow-glass-sm ring-1 ring-white/60">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold tracking-tight text-ink">
                  Today&apos;s pain level
                </h2>
                <span
                  className="tnum rounded-full px-2.5 py-0.5 text-[13px] font-bold text-white"
                  style={{ background: painColor(state.pain) }}
                >
                  {state.pain}/10
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={state.pain}
                onChange={(e) => setPain(Number(e.target.value))}
                aria-label="Pain level from 0 to 10"
                className="mt-3 w-full cursor-pointer accent-clinical-500"
                style={{ accentColor: painColor(state.pain) }}
              />
              <div className="mt-1 flex justify-between text-[11px] font-medium text-ink-faint">
                <span>No pain</span>
                <span>Worst imaginable</span>
              </div>
              {state.pain >= 7 && (
                <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-risk-deep">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  High pain — we&apos;ll flag this for your team.
                </p>
              )}
            </div>

            {/* Symptom check-in */}
            <div className="mx-5 mt-4 rounded-4xl bg-white/65 p-4 shadow-glass-sm ring-1 ring-white/60">
              <h2 className="text-[14px] font-bold tracking-tight text-ink">
                Any symptoms today?
              </h2>
              <p className="text-[12px] text-ink-muted">
                Tap anything you&apos;re noticing. Some are expected; some we watch.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {RECOVERY_SYMPTOMS.map((s) => {
                  const active = state.loggedSymptoms.includes(s.id);
                  const Icon = taskIcon(s.icon);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSymptom(s.id)}
                      className={cn(
                        "press focus-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all",
                        active && s.escalates
                          ? "border-transparent bg-risk text-white"
                          : active
                            ? "border-transparent bg-clinical-500 text-white"
                            : "border-ink/10 bg-white/50 text-ink-soft hover:bg-white",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rehab plan */}
            <div className="mx-5 mt-4 rounded-4xl bg-white/65 p-4 shadow-glass-sm ring-1 ring-white/60">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-[14px] font-bold tracking-tight text-ink">
                  Your rehab plan
                </h2>
                <span className="text-[11px] font-semibold text-ink-muted">
                  {rehabDone}/{state.rehab.length} done
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {state.rehab.map((r, i) => (
                  <motion.button
                    key={r.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => toggleRehab(r.id)}
                    className={cn(
                      "press focus-ring flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                      r.done ? "bg-mental/[0.07]" : "bg-white/70 shadow-glass-sm",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        r.done ? "border-transparent bg-mental" : "border-ink/15",
                      )}
                    >
                      <motion.span
                        initial={false}
                        animate={{ scale: r.done ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </motion.span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-[13px] font-semibold tracking-tight",
                          r.done ? "text-ink-faint line-through" : "text-ink",
                        )}
                      >
                        {r.title}
                      </p>
                      <p className="truncate text-[11px] text-ink-muted">{r.detail}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-ink/[0.06] px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
                      {r.sets}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="recovery-preview"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mx-5 mt-4 rounded-4xl bg-white/65 p-6 text-center shadow-glass-sm ring-1 ring-white/60"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-clinical-500/10 text-clinical-600">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h2 className="mt-3 text-[16px] font-bold tracking-tight text-ink">
              Post-op recovery is ready
            </h2>
            <p className="mx-auto mt-1.5 max-w-[16rem] text-[13px] leading-snug text-ink-muted">
              After surgery, SurgiOPT switches to a surgery-specific rehab plan and
              a daily check-in that watches for complications — with a clinician
              always in the loop.
            </p>
            <button
              onClick={togglePhase}
              className="press focus-ring mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-clinical-500 to-clinical-600 px-5 py-2.5 text-[14px] font-bold text-white shadow-ring"
            >
              Preview recovery mode
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
