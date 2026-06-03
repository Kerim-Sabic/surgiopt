"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Smartphone, LayoutDashboard, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { PatientApp } from "@/components/patient/PatientApp";
import { ClinicianDashboard } from "@/components/clinician/ClinicianDashboard";
import { avatarGradient } from "@/lib/utils";
import type { Surface } from "@/lib/types";

const IDENTITY: Record<Surface, { name: string; role: string; initials: string; hue: number }> = {
  patient: { name: "Eleanor Hayes", role: "Patient", initials: "EH", hue: 320 },
  clinician: { name: "Dr. Amara Reed", role: "Perioperative lead", initials: "AR", hue: 196 },
};

const ANNOTATIONS = [
  {
    title: "Apple-Activity readiness rings",
    body: "Three pillars + a composite Surgical Readiness Score, animated live.",
    side: "left" as const,
    top: "20%",
  },
  {
    title: "Real screening tools",
    body: "MUST, DASI, PHQ-9 & GAD-7 drive scores that update as you answer.",
    side: "right" as const,
    top: "38%",
  },
  {
    title: "Post-op safety net",
    body: "Flip to recovery mode — complication checks keep a clinician in the loop.",
    side: "left" as const,
    top: "64%",
  },
];

export function DemoShell() {
  const [surface, setSurface] = useState<Surface>("patient");
  const id = IDENTITY[surface];

  return (
    <div className="relative min-h-screen">
      {/* Global header */}
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo size="md" />
          <div className="absolute left-1/2 -translate-x-1/2">
            <SegmentedControl<Surface>
              value={surface}
              onChange={setSurface}
              layoutId="surface-toggle"
              options={[
                {
                  value: "patient",
                  label: "Patient App",
                  icon: <Smartphone className="h-4 w-4" />,
                },
                {
                  value: "clinician",
                  label: "Clinician",
                  icon: <LayoutDashboard className="h-4 w-4" />,
                },
              ]}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden text-right sm:block">
              <p className="text-[13px] font-bold leading-tight tracking-tight text-ink">
                {id.name}
              </p>
              <p className="text-[11px] leading-tight text-ink-muted">{id.role}</p>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold text-white shadow-glass-sm ring-2 ring-white"
              style={{ background: avatarGradient(id.hue) }}
            >
              {id.initials}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <AnimatePresence mode="wait">
        {surface === "patient" ? (
          <motion.section
            key="patient"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center px-4 pb-16 pt-8"
          >
            {/* Spotlight */}
            <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-clinical-300/25 blur-[120px]" />

            <div className="relative mb-7 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-clinical-700 shadow-glass-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Patient experience
              </span>
              <h1 className="mt-3 text-balance text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
                Eleanor&apos;s 21-day prehab journey
              </h1>
              <p className="mx-auto mt-1.5 max-w-md text-[14px] text-ink-muted">
                Tap through onboarding, the live assessment, daily plan, and recovery
                mode — everything is interactive.
              </p>
            </div>

            <div className="relative">
              {/* Floating annotations (xl only) */}
              {ANNOTATIONS.map((a) => (
                <div
                  key={a.title}
                  className={`pointer-events-none absolute hidden w-56 xl:block ${
                    a.side === "left" ? "right-full mr-10 text-right" : "left-full ml-10"
                  }`}
                  style={{ top: a.top }}
                >
                  <div className="glass card-sheen rounded-2xl p-3.5 shadow-glass-sm">
                    <p className="text-[13px] font-bold tracking-tight text-ink">
                      {a.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-ink-muted">
                      {a.body}
                    </p>
                  </div>
                </div>
              ))}

              <PatientApp />
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="clinician"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pt-6"
          >
            <ClinicianDashboard />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
