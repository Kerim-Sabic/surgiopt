"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ReadinessRing } from "./ReadinessRing";
import { AnimatedNumber } from "./AnimatedNumber";
import { PILLAR_META, cn } from "@/lib/utils";
import type { PillarKey } from "@/lib/types";

interface PillarCardProps {
  pillar: PillarKey;
  score: number;
  earned?: number;
  index?: number;
  onClick?: () => void;
}

/** Vertical pillar tile: gradient ring + animated score + tool reference. */
export function PillarCard({
  pillar,
  score,
  earned = 0,
  index = 0,
  onClick,
}: PillarCardProps) {
  const meta = PILLAR_META[pillar];
  const interactive = Boolean(onClick);

  const body = (
    <>
      <ReadinessRing
        value={score}
        size={92}
        stroke={9}
        color={meta.hex}
        colorTo={meta.softHex}
        delay={0.15 + index * 0.08}
      >
        <div className="flex flex-col items-center">
          <AnimatedNumber
            value={score}
            className="tnum text-2xl font-bold leading-none tracking-tight text-ink"
          />
          {earned > 0 && (
            <span
              className="mt-0.5 text-[10px] font-bold"
              style={{ color: meta.deepText }}
            >
              +{earned}
            </span>
          )}
        </div>
      </ReadinessRing>
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold tracking-tight text-ink">
          {meta.shortLabel}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-ink-faint">
          {meta.tool}
        </p>
      </div>
      {interactive && (
        <span className="absolute right-3 top-3 text-ink-faint">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </>
  );

  const className = cn(
    "glass card-sheen relative flex flex-col items-center rounded-3xl px-2 py-4 shadow-glass-sm",
    interactive && "press focus-ring text-left",
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 120, damping: 18 }}
    >
      {interactive ? (
        <button onClick={onClick} className={cn(className, "w-full")}>
          {body}
        </button>
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.div>
  );
}
