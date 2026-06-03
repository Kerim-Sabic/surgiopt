"use client";

import { motion } from "framer-motion";
import { CalendarDays, Stethoscope, ChevronRight, ShieldCheck } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { Logo } from "@/components/ui/Logo";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PATIENT_PROFILE } from "@/lib/mock-data";
import { PILLAR_META } from "@/lib/utils";
import type { PillarKey } from "@/lib/types";

interface OnboardingScreenProps {
  onStart: () => void;
}

const pillars: PillarKey[] = ["nutrition", "physical", "mental"];

const ease = [0.16, 1, 0.3, 1] as const;

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-clinical-700 via-clinical-800 to-clinical-900">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-clinical-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-48 h-72 w-72 rounded-full bg-mental/20 blur-3xl" />

      <StatusBar dark />

      <div className="flex h-[calc(100%-54px)] flex-col px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="pt-3"
        >
          <Logo variant="light" size="md" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease }}
          className="mt-10"
        >
          <p className="text-sm font-medium text-clinical-200">
            Good morning, {PATIENT_PROFILE.firstName}
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-white">
            Let&apos;s get you in the
            <br />
            best shape for surgery.
          </h1>
        </motion.div>

        {/* Countdown card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.7, ease }}
          className="glass-dark mt-7 rounded-4xl p-5 shadow-glass"
        >
          <div className="flex items-center gap-2 text-clinical-200">
            <CalendarDays className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Your surgery
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold tracking-tight text-white">
            {PATIENT_PROFILE.procedure}
          </p>
          <div className="mt-4 flex items-end gap-2">
            <AnimatedNumber
              value={PATIENT_PROFILE.daysToSurgery}
              className="tnum text-6xl font-bold leading-none tracking-tighter text-white"
            />
            <span className="pb-1.5 text-lg font-semibold text-clinical-200">
              days to go
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-sm text-clinical-100">
            <Stethoscope className="h-4 w-4 text-clinical-300" />
            <span className="font-medium">{PATIENT_PROFILE.surgeon}</span>
          </div>
          <p className="mt-1 pl-6 text-xs text-clinical-300">
            {PATIENT_PROFILE.surgeryDateLabel} · {PATIENT_PROFILE.hospital}
          </p>
        </motion.div>

        {/* Pillars teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6"
        >
          <p className="text-xs font-medium leading-relaxed text-clinical-200">
            Over the next three weeks we&apos;ll optimise three things shown by
            the evidence to lower complications and speed recovery:
          </p>
          <div className="mt-3 flex items-center gap-2">
            {pillars.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex flex-1 items-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5 ring-1 ring-white/10"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: PILLAR_META[p].hex }}
                />
                <span className="text-[11px] font-semibold text-white">
                  {PILLAR_META[p].shortLabel}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="flex-1" />

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease }}
          onClick={onStart}
          className="press focus-ring group mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-white text-[15px] font-bold tracking-tight text-clinical-700 shadow-lift"
        >
          Begin your assessment
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-clinical-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Aligned with ERAS perioperative guidelines
        </p>
      </div>
    </div>
  );
}
