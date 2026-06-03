"use client";

import { motion } from "framer-motion";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { StatusBar } from "../StatusBar";
import { ReadinessRing } from "@/components/ui/ReadinessRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { usePatient } from "@/lib/store";
import { ASSESSMENT_QUESTIONS } from "@/lib/mock-data";
import { PILLAR_META, cn } from "@/lib/utils";
import type { AssessmentQuestion, PillarKey } from "@/lib/types";

interface AssessmentScreenProps {
  onComplete: () => void;
}

const PILLARS: PillarKey[] = ["nutrition", "physical", "mental"];

export function AssessmentScreen({ onComplete }: AssessmentScreenProps) {
  const { state, baselines, setAnswer } = usePatient();

  return (
    <div className="relative flex h-full flex-col bg-[#EEF2F5]">
      <StatusBar />

      {/* Sticky live summary */}
      <div className="sticky top-0 z-30 border-b border-ink/5 bg-[#EEF2F5]/85 px-5 pb-3 pt-1 backdrop-blur-xl">
        <h1 className="text-[22px] font-bold tracking-tight text-ink">
          Your prehab assessment
        </h1>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          Answer honestly — your rings update live.
        </p>
        <div className="mt-3 flex items-center justify-around">
          {PILLARS.map((p) => (
            <div key={p} className="flex flex-col items-center">
              <ReadinessRing
                value={baselines[p]}
                size={62}
                stroke={7}
                color={PILLAR_META[p].hex}
                colorTo={PILLAR_META[p].softHex}
              >
                <AnimatedNumber
                  value={baselines[p]}
                  className="tnum text-base font-bold tracking-tight text-ink"
                />
              </ReadinessRing>
              <span className="mt-1 text-[11px] font-semibold text-ink-soft">
                {PILLAR_META[p].shortLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-32 pt-4">
        {PILLARS.map((pillar) => {
          const meta = PILLAR_META[pillar];
          const items = ASSESSMENT_QUESTIONS.filter((q) => q.pillar === pillar);
          return (
            <section key={pillar} className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: meta.hex }}
                />
                <h2 className="text-sm font-bold tracking-tight text-ink">
                  {meta.label}
                </h2>
                <span className="ml-auto text-[11px] font-semibold text-ink-faint">
                  {meta.tool}
                </span>
              </div>
              <div className="space-y-3">
                {items.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={i}
                    selected={state.answers[q.id] ?? 0}
                    onSelect={(idx) => setAnswer(q.id, idx)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Sticky CTA */}
      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#EEF2F5] via-[#EEF2F5]/95 to-transparent px-5 pb-7 pt-6">
        <button
          onClick={onComplete}
          className="press focus-ring group flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-clinical-500 to-clinical-600 text-[15px] font-bold tracking-tight text-white shadow-ring"
        >
          <Sparkles className="h-4 w-4" />
          See my readiness score
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  selected,
  onSelect,
}: {
  question: AssessmentQuestion;
  index: number;
  selected: number;
  onSelect: (idx: number) => void;
}) {
  const meta = PILLAR_META[question.pillar];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass card-sheen rounded-3xl p-4 shadow-glass-sm"
    >
      <span
        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
        style={{ color: meta.deepText, background: `${meta.hex}1f` }}
      >
        {question.toolRef}
      </span>
      <p className="mt-2 text-[14px] font-semibold leading-snug tracking-tight text-ink">
        {question.prompt}
      </p>
      <div className="mt-3 space-y-1.5">
        {question.options.map((opt, idx) => {
          const active = idx === selected;
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={cn(
                "press focus-ring flex w-full items-center justify-between rounded-2xl border px-3.5 py-2.5 text-left text-[13px] font-medium transition-all",
                active
                  ? "border-transparent text-ink shadow-glass-sm"
                  : "border-ink/[0.07] bg-white/40 text-ink-soft hover:bg-white/70",
              )}
              style={
                active ? { background: `${meta.hex}1a`, borderColor: meta.hex } : undefined
              }
            >
              {opt.label}
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full transition-all",
                  active ? "scale-100" : "scale-90 bg-ink/5",
                )}
                style={active ? { background: meta.hex } : undefined}
              >
                {active && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
