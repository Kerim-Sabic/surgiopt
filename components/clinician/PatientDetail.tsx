"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  CalendarClock,
  Activity,
  ClipboardList,
  TrendingUp,
  Bell,
} from "lucide-react";
import { ReadinessRing } from "@/components/ui/ReadinessRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { AlertPanel } from "./AlertPanel";
import { TrendChart } from "./TrendChart";
import { PILLAR_META, avatarGradient, cn, initials } from "@/lib/utils";
import type { Patient, PillarKey, ScreeningSeverity } from "@/lib/types";

const SEV: Record<ScreeningSeverity, { label: string; cls: string; dot: string }> = {
  good: { label: "Good", cls: "bg-ready-soft text-ready-deep", dot: "bg-ready" },
  watch: { label: "Watch", cls: "bg-attention-soft text-attention-deep", dot: "bg-attention" },
  concern: { label: "Concern", cls: "bg-risk-soft text-risk-deep", dot: "bg-risk" },
};

const PILLARS: PillarKey[] = ["nutrition", "physical", "mental"];

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

export function PatientDetail({ patient, onBack }: PatientDetailProps) {
  const ringColor =
    patient.risk === "high" ? "#E26A5E" : patient.risk === "moderate" ? "#E8A53C" : "#34B97E";
  const openAlerts = patient.alerts.filter((a) => a.requiresDecision).length;

  return (
    <div>
      <button
        onClick={onBack}
        className="press focus-ring mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/60 py-2 pl-2.5 pr-4 text-[13px] font-semibold text-ink-soft shadow-glass-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        All patients
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass card-sheen flex flex-col gap-5 rounded-4xl p-5 shadow-glass sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-xl font-bold text-white shadow-glass-sm"
            style={{ background: avatarGradient(patient.avatarHue) }}
          >
            {initials(patient.name)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-bold tracking-tight text-ink">
                {patient.name}
              </h1>
              <RiskBadge risk={patient.risk} size="sm" />
              {patient.phase === "recovery" && (
                <span className="rounded-full bg-mental/15 px-2 py-0.5 text-[11px] font-bold text-mental-deep">
                  POST-OP DAY {Math.abs(patient.daysToSurgery)}
                </span>
              )}
            </div>
            <p className="mt-1 text-[14px] font-medium text-ink-soft">
              {patient.age} · {patient.sex === "F" ? "Female" : "Male"} · {patient.procedure}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-muted">
              <CalendarClock className="h-3.5 w-3.5" />
              {patient.daysToSurgery < 0
                ? `${Math.abs(patient.daysToSurgery)} days post-op`
                : `Surgery in ${patient.daysToSurgery} days`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-ink/5 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <ReadinessRing
            value={patient.readiness}
            size={86}
            stroke={9}
            color={ringColor}
            colorTo={ringColor}
          >
            <div className="flex flex-col items-center">
              <AnimatedNumber
                value={patient.readiness}
                className="tnum text-2xl font-bold tracking-tight text-ink"
              />
              <span className="text-[9px] font-semibold uppercase tracking-wide text-ink-faint">
                / 100
              </span>
            </div>
          </ReadinessRing>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              Surgical
              <br />
              Readiness
            </p>
          </div>
        </div>
      </motion.div>

      {/* Body grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Pillars */}
          <Section icon={<Activity className="h-4 w-4" />} title="Prehabilitation pillars">
            <div className="grid grid-cols-3 gap-3">
              {PILLARS.map((p) => {
                const meta = PILLAR_META[p];
                return (
                  <div
                    key={p}
                    className="flex flex-col items-center rounded-2xl bg-white/50 p-3 ring-1 ring-white/60"
                  >
                    <ReadinessRing
                      value={patient.pillars[p]}
                      size={64}
                      stroke={7}
                      color={meta.hex}
                      colorTo={meta.softHex}
                    >
                      <span className="tnum text-base font-bold text-ink">
                        {patient.pillars[p]}
                      </span>
                    </ReadinessRing>
                    <p className="mt-2 text-[12px] font-bold text-ink">{meta.shortLabel}</p>
                    <p className="text-[10px] font-medium text-ink-faint">{meta.tool}</p>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Screenings */}
          <Section icon={<ClipboardList className="h-4 w-4" />} title="Validated screening results">
            <div className="space-y-2">
              {patient.screenings.map((s) => {
                const sev = SEV[s.severity];
                return (
                  <div
                    key={s.tool}
                    className="flex items-center gap-3 rounded-2xl bg-white/50 p-3 ring-1 ring-white/60"
                  >
                    <div className="w-20 shrink-0">
                      <p className="text-[13px] font-bold text-ink">{s.tool}</p>
                      <p className="text-[10px] leading-tight text-ink-faint">{s.fullName}</p>
                    </div>
                    <div className="min-w-0 flex-1 border-l border-ink/5 pl-3">
                      <p className="tnum text-[13px] font-semibold text-ink-soft">
                        {s.scoreLabel}
                      </p>
                      <p className="text-[11.5px] leading-snug text-ink-muted">
                        {s.interpretation}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
                        sev.cls,
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", sev.dot)} />
                      {sev.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Trend */}
          <Section icon={<TrendingUp className="h-4 w-4" />} title="Readiness trend">
            <TrendChart data={patient.trend} color={ringColor} />
          </Section>
        </div>

        {/* Aside: alerts */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Bell className="h-4 w-4 text-clinical-600" />
            <h2 className="text-[14px] font-bold tracking-tight text-ink">
              Clinical alerts
            </h2>
            {openAlerts > 0 && (
              <span className="rounded-full bg-risk px-2 py-0.5 text-[11px] font-bold text-white">
                {openAlerts} open
              </span>
            )}
          </div>
          <AlertPanel alerts={patient.alerts} />
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass card-sheen rounded-4xl p-4 shadow-glass-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clinical-500/10 text-clinical-600">
          {icon}
        </span>
        <h2 className="text-[14px] font-bold tracking-tight text-ink">{title}</h2>
      </div>
      {children}
    </div>
  );
}
