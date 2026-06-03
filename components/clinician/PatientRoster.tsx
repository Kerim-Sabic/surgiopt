"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Search, Bell, CalendarClock } from "lucide-react";
import { Sparkline } from "@/components/ui/Sparkline";
import { ReadinessRing } from "@/components/ui/ReadinessRing";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { avatarGradient, cn, initials } from "@/lib/utils";
import type { Patient, RiskLevel } from "@/lib/types";

type RiskFilter = RiskLevel | "all";
type SortKey = "risk" | "readiness" | "days" | "name";

const RISK_ORDER: Record<RiskLevel, number> = { high: 0, moderate: 1, low: 2 };

const SORTS: { key: SortKey; label: string }[] = [
  { key: "risk", label: "Risk" },
  { key: "readiness", label: "Readiness" },
  { key: "days", label: "Surgery date" },
  { key: "name", label: "Name" },
];

interface PatientRosterProps {
  patients: Patient[];
  onSelect: (id: string) => void;
}

export function PatientRoster({ patients, onSelect }: PatientRosterProps) {
  const [filter, setFilter] = useState<RiskFilter>("all");
  const [sort, setSort] = useState<SortKey>("risk");

  const rows = useMemo(() => {
    const filtered =
      filter === "all" ? patients : patients.filter((p) => p.risk === filter);
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "risk":
          return RISK_ORDER[a.risk] - RISK_ORDER[b.risk] || a.readiness - b.readiness;
        case "readiness":
          return b.readiness - a.readiness;
        case "days":
          return a.daysToSurgery - b.daysToSurgery;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return sorted;
  }, [patients, filter, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl<RiskFilter>
          value={filter}
          onChange={setFilter}
          size="sm"
          layoutId="roster-filter"
          options={[
            { value: "all", label: "All" },
            { value: "high", label: "High" },
            { value: "moderate", label: "Moderate" },
            { value: "low", label: "Low" },
          ]}
        />
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-semibold text-ink-faint">Sort</span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cn(
                "press focus-ring rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                sort === s.key
                  ? "bg-ink text-white"
                  : "bg-white/60 text-ink-muted hover:text-ink-soft",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column header */}
      <div className="mt-4 hidden grid-cols-[2.4fr_1.2fr_1fr_1.1fr_auto] items-center gap-4 px-4 text-[11px] font-semibold uppercase tracking-wide text-ink-faint md:grid">
        <span>Patient</span>
        <span>Procedure</span>
        <span>Surgery</span>
        <span>Trend</span>
        <span className="text-right">Readiness</span>
      </div>

      {/* Rows */}
      <div className="mt-2 space-y-2.5">
        {rows.map((p, i) => (
          <RosterRow key={p.id} patient={p} index={i} onSelect={onSelect} />
        ))}
        {rows.length === 0 && (
          <div className="glass flex flex-col items-center rounded-3xl py-12 text-center shadow-glass-sm">
            <Search className="h-6 w-6 text-ink-faint" />
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              No patients in this filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RosterRow({
  patient,
  index,
  onSelect,
}: {
  patient: Patient;
  index: number;
  onSelect: (id: string) => void;
}) {
  const openAlerts = patient.alerts.filter((a) => a.requiresDecision).length;
  const ringColor =
    patient.risk === "high" ? "#E26A5E" : patient.risk === "moderate" ? "#E8A53C" : "#34B97E";

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 140, damping: 20 }}
      onClick={() => onSelect(patient.id)}
      className="press focus-ring group glass card-sheen grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-3xl p-3.5 text-left shadow-glass-sm transition-shadow hover:shadow-lift md:grid-cols-[2.4fr_1.2fr_1fr_1.1fr_auto] md:gap-4"
    >
      {/* Identity */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-glass-sm"
          style={{ background: avatarGradient(patient.avatarHue) }}
        >
          {initials(patient.name)}
          {openAlerts > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-risk text-[9px] font-bold text-white ring-2 ring-white">
              {openAlerts}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold tracking-tight text-ink">
            {patient.name}
          </p>
          <p className="text-[12px] text-ink-muted">
            {patient.age} · {patient.sex === "F" ? "Female" : "Male"}
            {patient.phase === "recovery" && (
              <span className="ml-1.5 rounded-full bg-mental/15 px-1.5 py-0.5 text-[10px] font-bold text-mental-deep">
                POST-OP
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Procedure */}
      <p className="hidden truncate text-[13px] font-medium text-ink-soft md:block">
        {patient.procedure}
      </p>

      {/* Surgery timing */}
      <div className="hidden items-center gap-1.5 text-[13px] font-semibold text-ink-soft md:flex">
        <CalendarClock className="h-3.5 w-3.5 text-ink-faint" />
        {patient.daysToSurgery < 0
          ? `+${Math.abs(patient.daysToSurgery)}d post`
          : `${patient.daysToSurgery}d`}
      </div>

      {/* Sparkline */}
      <div className="hidden md:block">
        <Sparkline data={patient.trend} color={ringColor} width={92} height={30} />
      </div>

      {/* Readiness + risk */}
      <div className="flex items-center justify-end gap-3">
        {openAlerts > 0 && (
          <span className="hidden items-center gap-1 rounded-full bg-risk-soft px-2 py-1 text-[11px] font-bold text-risk-deep sm:flex">
            <Bell className="h-3 w-3" />
            Alert
          </span>
        )}
        <RiskBadge risk={patient.risk} size="sm" className="hidden sm:inline-flex" />
        <ReadinessRing
          value={patient.readiness}
          size={44}
          stroke={5}
          color={ringColor}
          delay={index * 0.05}
        >
          <span className="tnum text-[13px] font-bold text-ink">{patient.readiness}</span>
        </ReadinessRing>
        <ChevronRight className="h-5 w-5 text-ink-faint transition-transform group-hover:translate-x-0.5" />
      </div>
    </motion.button>
  );
}
