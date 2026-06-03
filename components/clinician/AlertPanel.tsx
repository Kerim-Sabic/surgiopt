"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  Stethoscope,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PatientAlert } from "@/lib/types";

const SEVERITY = {
  good: { ring: "ring-ready/30", bg: "bg-ready-soft", text: "text-ready-deep", icon: "text-ready" },
  watch: { ring: "ring-attention/30", bg: "bg-attention-soft", text: "text-attention-deep", icon: "text-attention" },
  concern: { ring: "ring-risk/30", bg: "bg-risk-soft", text: "text-risk-deep", icon: "text-risk" },
} as const;

type Decision = "escalated" | "monitoring" | null;

export function AlertPanel({ alerts }: { alerts: PatientAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="glass card-sheen flex flex-col items-center rounded-3xl p-6 text-center shadow-glass-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ready-soft text-ready-deep">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <p className="mt-3 text-sm font-bold text-ink">No active alerts</p>
        <p className="mt-1 text-[12px] text-ink-muted">
          Monitoring continues. You&apos;ll be notified if anything changes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}

function AlertCard({ alert }: { alert: PatientAlert }) {
  const [decision, setDecision] = useState<Decision>(null);
  const sev = SEVERITY[alert.severity];

  return (
    <motion.div
      layout
      className={cn(
        "glass card-sheen rounded-3xl p-4 shadow-glass-sm ring-1",
        sev.ring,
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl", sev.bg)}>
          <AlertTriangle className={cn("h-5 w-5", sev.icon)} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] font-bold tracking-tight text-ink">{alert.title}</p>
            <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-ink-faint">
              <Clock className="h-3 w-3" />
              {alert.loggedAt}
            </span>
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">{alert.detail}</p>
        </div>
      </div>

      {alert.requiresDecision && (
        <div className="mt-3 rounded-2xl bg-ink/[0.04] p-3">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
            <Stethoscope className="h-3.5 w-3.5 text-clinical-600" />
            Physician decision required
          </p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-ink-muted">
            SurgiOPT surfaces this pattern for your review. It never escalates,
            prescribes, or contacts the patient automatically.
          </p>

          <AnimatePresence mode="wait">
            {decision === null ? (
              <motion.div
                key="actions"
                exit={{ opacity: 0 }}
                className="mt-3 flex flex-wrap gap-2"
              >
                <button
                  onClick={() => setDecision("escalated")}
                  className="press focus-ring flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-risk to-risk-deep px-3.5 py-2 text-[12.5px] font-bold text-white shadow-[0_8px_20px_-10px_rgba(200,74,62,0.6)]"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  Escalate to on-call
                </button>
                <button
                  onClick={() => setDecision("monitoring")}
                  className="press focus-ring rounded-xl bg-white/70 px-3.5 py-2 text-[12.5px] font-bold text-ink-soft shadow-glass-sm ring-1 ring-ink/5"
                >
                  Acknowledge & monitor
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="resolved"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-bold",
                  decision === "escalated"
                    ? "bg-risk-soft text-risk-deep"
                    : "bg-ready-soft text-ready-deep",
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                {decision === "escalated"
                  ? "Escalated — on-call surgeon paged. Logged to chart."
                  : "Acknowledged — monitoring plan recorded."}
                <button
                  onClick={() => setDecision(null)}
                  className="focus-ring ml-auto text-[11px] font-semibold text-ink-muted underline-offset-2 hover:underline"
                >
                  Undo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
