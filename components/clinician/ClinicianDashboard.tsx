"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Gauge, AlertTriangle, BellRing } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { PatientRoster } from "./PatientRoster";
import { PatientDetail } from "./PatientDetail";
import { PATIENTS } from "@/lib/mock-data";

export function ClinicianDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => PATIENTS.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  const kpis = useMemo(() => {
    const count = PATIENTS.length;
    const avg = Math.round(
      PATIENTS.reduce((s, p) => s + p.readiness, 0) / count,
    );
    const high = PATIENTS.filter((p) => p.risk === "high").length;
    const openAlerts = PATIENTS.reduce(
      (s, p) => s + p.alerts.filter((a) => a.requiresDecision).length,
      0,
    );
    return { count, avg, high, openAlerts };
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-2 sm:px-8">
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="mt-6"
          >
            <PatientDetail patient={selected} onBack={() => setSelectedId(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="roster"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="mt-6"
          >
            {/* Title */}
            <div className="mb-4">
              <h1 className="text-[26px] font-bold tracking-tight text-ink">
                Prehab roster
              </h1>
              <p className="mt-0.5 text-[14px] text-ink-muted">
                Risk-stratified across the surgical journey · {kpis.count} active patients
              </p>
            </div>

            {/* KPI strip */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard
                label="Active patients"
                value={kpis.count}
                icon={<Users className="h-4 w-4" />}
                accent="#1F7C8E"
                hint="Across prehab & recovery"
              />
              <MetricCard
                label="Avg readiness"
                value={kpis.avg}
                unit="/100"
                icon={<Gauge className="h-4 w-4" />}
                accent="#2FB37E"
                hint="Cohort mean"
              />
              <MetricCard
                label="High risk"
                value={kpis.high}
                icon={<AlertTriangle className="h-4 w-4" />}
                accent="#E26A5E"
                hint="Need escalated prehab"
              />
              <MetricCard
                label="Open alerts"
                value={kpis.openAlerts}
                icon={<BellRing className="h-4 w-4" />}
                accent="#E8A53C"
                hint="Awaiting decision"
              />
            </div>

            <PatientRoster patients={PATIENTS} onSelect={setSelectedId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
