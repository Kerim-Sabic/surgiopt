// ───────────────────────────────────────────────────────────────────────────
// SurgiOPT domain model — strict, fully typed, no `any`.
// ───────────────────────────────────────────────────────────────────────────

export type PillarKey = "nutrition" | "physical" | "mental";

export interface PillarMeta {
  key: PillarKey;
  label: string;
  shortLabel: string;
  /** The validated clinical screening tool(s) behind this pillar. */
  tool: string;
  description: string;
}

export type RiskLevel = "low" | "moderate" | "high";

export type SurgicalPhase = "prehab" | "recovery";

// ── Readiness ──────────────────────────────────────────────────────────────

/** A 0–100 score per pillar plus the composite Surgical Readiness Score. */
export interface PillarScores {
  nutrition: number;
  physical: number;
  mental: number;
}

// ── Assessment questionnaire ────────────────────────────────────────────────

export interface AssessmentOption {
  label: string;
  /** Contribution to readiness for this item (higher = more ready). */
  value: number;
}

export interface AssessmentQuestion {
  id: string;
  pillar: PillarKey;
  /** e.g. "MUST · Item 2" */
  toolRef: string;
  prompt: string;
  options: AssessmentOption[];
}

// ── Daily plan / tasks ──────────────────────────────────────────────────────

export interface PlanTask {
  id: string;
  pillar: PillarKey;
  title: string;
  detail: string;
  /** Readiness points this task contributes to its pillar when completed. */
  points: number;
  /** Icon key resolved in the UI layer. */
  icon: TaskIcon;
  done: boolean;
}

export type TaskIcon =
  | "meal"
  | "hydration"
  | "supplement"
  | "walk"
  | "strength"
  | "breathing"
  | "mindfulness"
  | "sleep";

// ── Trends / charts ─────────────────────────────────────────────────────────

export interface TrendPoint {
  /** Short day label, e.g. "Day 1", "W1". */
  label: string;
  value: number;
}

export interface WalkTestPoint {
  week: string;
  /** 6-Minute Walk Test distance in metres. */
  distance: number;
  /** Population target band for context. */
  target: number;
}

// ── Recovery / post-op ──────────────────────────────────────────────────────

export type RecoveryStatus = "on-track" | "flag";

export interface RecoverySymptom {
  id: string;
  label: string;
  /** Whether logging this symptom should escalate to physician review. */
  escalates: boolean;
  icon: TaskIcon | "fever" | "wound" | "nausea" | "breath";
}

export interface RehabExercise {
  id: string;
  title: string;
  detail: string;
  sets: string;
  done: boolean;
}

// ── Clinician: screening tool results ───────────────────────────────────────

export type ScreeningSeverity = "good" | "watch" | "concern";

export interface ScreeningResult {
  tool: string;
  fullName: string;
  scoreLabel: string;
  interpretation: string;
  severity: ScreeningSeverity;
  pillar: PillarKey;
}

// ── Clinician: patients ─────────────────────────────────────────────────────

export interface PatientAlert {
  id: string;
  title: string;
  detail: string;
  severity: ScreeningSeverity;
  loggedAt: string;
  requiresDecision: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: "F" | "M";
  procedure: string;
  /** Negative once the patient is post-op. */
  daysToSurgery: number;
  phase: SurgicalPhase;
  readiness: number;
  risk: RiskLevel;
  pillars: PillarScores;
  /** 8-point readiness sparkline (oldest → newest). */
  trend: number[];
  screenings: ScreeningResult[];
  alerts: PatientAlert[];
  avatarHue: number;
}

// ── Demo surface ────────────────────────────────────────────────────────────

export type Surface = "patient" | "clinician";

export type PatientTab = "home" | "plan" | "physical" | "recovery";

export type PatientView = "onboarding" | "assessment" | "app";
