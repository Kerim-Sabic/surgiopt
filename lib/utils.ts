import type { PillarKey, PillarScores, RiskLevel } from "./types";

/** Tailwind-class concatenator (clsx-lite, no dependency). */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** Composite Surgical Readiness Score — weighted toward physical capacity. */
export function compositeReadiness(p: PillarScores): number {
  const weighted =
    p.nutrition * 0.32 + p.physical * 0.4 + p.mental * 0.28;
  return Math.round(clamp(weighted));
}

export function riskFromReadiness(score: number): RiskLevel {
  if (score >= 78) return "low";
  if (score >= 58) return "moderate";
  return "high";
}

export const PILLAR_META: Record<
  PillarKey,
  {
    label: string;
    shortLabel: string;
    tool: string;
    description: string;
    /** Tailwind text/stroke color token base, e.g. "nutrition". */
    token: PillarKey;
    /** Hex used for SVG strokes & charts. */
    hex: string;
    softHex: string;
    /** Deep shade for text on light backgrounds. */
    deepText: string;
  }
> = {
  nutrition: {
    label: "Nutritional & Immune",
    shortLabel: "Nutrition",
    tool: "MUST",
    description: "Malnutrition Universal Screening Tool",
    token: "nutrition",
    hex: "#2FB37E",
    softHex: "#7FD8AE",
    deepText: "#1C8F62",
  },
  physical: {
    label: "Physical Prehab",
    shortLabel: "Physical",
    tool: "DASI · 6MWT",
    description: "Duke Activity Status Index & 6-Minute Walk Test",
    token: "physical",
    hex: "#2E9BD6",
    softHex: "#7FC6EA",
    deepText: "#1A77AE",
  },
  mental: {
    label: "Psychological Resilience",
    shortLabel: "Mental",
    tool: "PHQ-9 · GAD-7",
    description: "Depression & anxiety screening",
    token: "mental",
    hex: "#7C6BE0",
    softHex: "#B3A8F0",
    deepText: "#5B49C2",
  },
};

export const RISK_META: Record<
  RiskLevel,
  { label: string; tone: string; dot: string; ring: string }
> = {
  low: {
    label: "Low risk",
    tone: "bg-ready-soft text-ready-deep",
    dot: "bg-ready",
    ring: "ring-ready/30",
  },
  moderate: {
    label: "Moderate",
    tone: "bg-attention-soft text-attention-deep",
    dot: "bg-attention",
    ring: "ring-attention/30",
  },
  high: {
    label: "High risk",
    tone: "bg-risk-soft text-risk-deep",
    dot: "bg-risk",
    ring: "ring-risk/30",
  },
};

/** Deterministic pseudo-avatar gradient from a hue. */
export function avatarGradient(hue: number): string {
  return `linear-gradient(135deg, hsl(${hue} 55% 62%) 0%, hsl(${
    (hue + 38) % 360
  } 58% 48%) 100%)`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
