import {
  compositeReadiness,
  riskFromReadiness,
} from "./utils";
import type {
  AssessmentQuestion,
  Patient,
  PillarScores,
  PlanTask,
  RecoverySymptom,
  RehabExercise,
  ScreeningResult,
  PatientAlert,
  WalkTestPoint,
} from "./types";

// ───────────────────────────────────────────────────────────────────────────
// The patient-app persona (the "you" surface).
// ───────────────────────────────────────────────────────────────────────────

export const PATIENT_PROFILE = {
  firstName: "Eleanor",
  fullName: "Eleanor Hayes",
  procedure: "Laparoscopic Cholecystectomy",
  surgeon: "Mr. A. Okafor, General Surgery",
  hospital: "St. Aldwyn's NHS Trust",
  daysToSurgery: 21,
  surgeryDateLabel: "Wed 24 June",
};

// ───────────────────────────────────────────────────────────────────────────
// Assessment questionnaire — simplified, clinically-grounded items.
// Each pillar has 3 items; option values sum to a max of 30 per pillar and are
// normalised to a 0–100 readiness score that updates live.
// ───────────────────────────────────────────────────────────────────────────

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ── Nutrition · MUST ──
  {
    id: "n1",
    pillar: "nutrition",
    toolRef: "MUST · Intake",
    prompt: "How has your appetite and food intake been recently?",
    options: [
      { label: "Eating normally", value: 10 },
      { label: "Slightly reduced", value: 7 },
      { label: "Noticeably reduced", value: 3 },
      { label: "Very poor — skipping meals", value: 0 },
    ],
  },
  {
    id: "n2",
    pillar: "nutrition",
    toolRef: "MUST · Weight loss",
    prompt: "Any unplanned weight loss in the past 3–6 months?",
    options: [
      { label: "None", value: 10 },
      { label: "A little (under 5%)", value: 7 },
      { label: "Some (5–10%)", value: 4 },
      { label: "A lot (over 10%)", value: 0 },
    ],
  },
  {
    id: "n3",
    pillar: "nutrition",
    toolRef: "Protein & hydration",
    prompt: "On a typical day, how close are you to your protein & fluid targets?",
    options: [
      { label: "I hit them", value: 10 },
      { label: "Most days", value: 7 },
      { label: "Sometimes", value: 4 },
      { label: "Rarely", value: 1 },
    ],
  },
  // ── Physical · DASI / 6MWT ──
  {
    id: "p1",
    pillar: "physical",
    toolRef: "DASI · Item 3",
    prompt: "Can you climb a flight of stairs without stopping?",
    options: [
      { label: "Easily", value: 10 },
      { label: "With mild effort", value: 7 },
      { label: "Slowly, need a pause", value: 4 },
      { label: "Not without stopping", value: 1 },
    ],
  },
  {
    id: "p2",
    pillar: "physical",
    toolRef: "DASI · Item 6",
    prompt: "Can you do 20+ minutes of moderate activity (brisk walk, housework)?",
    options: [
      { label: "Yes, comfortably", value: 10 },
      { label: "Yes, but tiring", value: 7 },
      { label: "Only briefly", value: 4 },
      { label: "No", value: 1 },
    ],
  },
  {
    id: "p3",
    pillar: "physical",
    toolRef: "6MWT proxy",
    prompt: "Roughly how far could you walk in 6 minutes today?",
    options: [
      { label: "Over 500 m", value: 10 },
      { label: "400–500 m", value: 7 },
      { label: "300–400 m", value: 4 },
      { label: "Under 300 m", value: 1 },
    ],
  },
  // ── Mental · PHQ-9 / GAD-7 ──
  {
    id: "m1",
    pillar: "mental",
    toolRef: "PHQ-9 · Item 1",
    prompt: "Over the last 2 weeks: little interest or pleasure in doing things?",
    options: [
      { label: "Not at all", value: 10 },
      { label: "Several days", value: 7 },
      { label: "More than half the days", value: 3 },
      { label: "Nearly every day", value: 0 },
    ],
  },
  {
    id: "m2",
    pillar: "mental",
    toolRef: "GAD-7 · Item 1",
    prompt: "Feeling nervous, anxious, or on edge about your surgery?",
    options: [
      { label: "Not at all", value: 10 },
      { label: "Several days", value: 7 },
      { label: "More than half the days", value: 3 },
      { label: "Nearly every day", value: 0 },
    ],
  },
  {
    id: "m3",
    pillar: "mental",
    toolRef: "Resilience · Sleep",
    prompt: "How rested do you feel — sleep and day-to-day stress?",
    options: [
      { label: "Well rested", value: 10 },
      { label: "Okay", value: 7 },
      { label: "Often tired or stressed", value: 3 },
      { label: "Exhausted", value: 0 },
    ],
  },
];

/** Pre-selected defaults → deterministic baseline scores on first load. */
export const ASSESSMENT_DEFAULTS: Record<string, number> = {
  n1: 1, // Slightly reduced (7)
  n2: 1, // A little (7)
  n3: 1, // Most days (7)        → 21/30 = 70
  p1: 1, // Mild effort (7)
  p2: 2, // Only briefly (4)
  p3: 1, // 400–500 m (7)        → 18/30 = 60
  m1: 1, // Several days (7)
  m2: 1, // Several days (7)
  m3: 2, // Often tired (3)      → 17/30 ≈ 57
};

/** Normalise selected option values for a pillar into a 0–100 score. */
export function scorePillarFromAnswers(
  pillar: "nutrition" | "physical" | "mental",
  answers: Record<string, number>,
): number {
  const items = ASSESSMENT_QUESTIONS.filter((q) => q.pillar === pillar);
  let got = 0;
  let max = 0;
  for (const q of items) {
    const idx = answers[q.id] ?? 0;
    got += q.options[idx]?.value ?? 0;
    max += Math.max(...q.options.map((o) => o.value));
  }
  return Math.round((got / max) * 100);
}

// ───────────────────────────────────────────────────────────────────────────
// Daily plan — prehab. Completing a task adds points to its pillar.
// ───────────────────────────────────────────────────────────────────────────

export const DAILY_PLAN: PlanTask[] = [
  {
    id: "t-protein",
    pillar: "nutrition",
    title: "Hit your protein target",
    detail: "90 g across 3 meals — supports tissue repair",
    points: 5,
    icon: "meal",
    done: false,
  },
  {
    id: "t-hydration",
    pillar: "nutrition",
    title: "Drink 2 L of fluids",
    detail: "Steady hydration through the day",
    points: 5,
    icon: "hydration",
    done: false,
  },
  {
    id: "t-supplement",
    pillar: "nutrition",
    title: "Immune & micronutrient dose",
    detail: "Vitamin D, zinc, and your prescribed supplement",
    points: 4,
    icon: "supplement",
    done: false,
  },
  {
    id: "t-walk",
    pillar: "physical",
    title: "Walk 6,000 steps",
    detail: "Build aerobic capacity ahead of surgery",
    points: 7,
    icon: "walk",
    done: false,
  },
  {
    id: "t-strength",
    pillar: "physical",
    title: "Strength circuit — 12 min",
    detail: "Sit-to-stands, wall press, banded rows",
    points: 6,
    icon: "strength",
    done: false,
  },
  {
    id: "t-mobility",
    pillar: "physical",
    title: "Mobility & stretch",
    detail: "Hips, thoracic spine, calves",
    points: 5,
    icon: "sleep",
    done: false,
  },
  {
    id: "t-breathing",
    pillar: "mental",
    title: "5-minute breathing exercise",
    detail: "Box breathing to settle the nervous system",
    points: 5,
    icon: "breathing",
    done: false,
  },
  {
    id: "t-mindfulness",
    pillar: "mental",
    title: "CBT reframe · 1 worry",
    detail: "Name it, challenge it, plan one small action",
    points: 5,
    icon: "mindfulness",
    done: false,
  },
  {
    id: "t-sleep",
    pillar: "mental",
    title: "Wind-down routine",
    detail: "Screens off, lights low by 10:30 pm",
    points: 4,
    icon: "sleep",
    done: false,
  },
];

// ───────────────────────────────────────────────────────────────────────────
// Physical pillar detail — 6-Minute Walk Test trend.
// ───────────────────────────────────────────────────────────────────────────

export const WALK_TEST_TREND: WalkTestPoint[] = [
  { week: "Wk 1", distance: 362, target: 500 },
  { week: "Wk 2", distance: 388, target: 500 },
  { week: "Wk 3", distance: 406, target: 500 },
  { week: "Wk 4", distance: 431, target: 500 },
  { week: "Wk 5", distance: 458, target: 500 },
  { week: "Now", distance: 482, target: 500 },
];

export const EXERCISE_OF_THE_DAY = {
  title: "Tempo intervals + lower-body strength",
  duration: "18 min",
  focus: "Aerobic base · Quad & glute strength",
  blocks: [
    { name: "Brisk walk warm-up", detail: "4 min · RPE 4/10" },
    { name: "Tempo intervals", detail: "5 × (1 min brisk / 1 min easy)" },
    { name: "Sit-to-stand", detail: "3 × 10 · controlled tempo" },
    { name: "Wall press + banded row", detail: "3 × 12" },
    { name: "Calf & hip flexor stretch", detail: "3 min cooldown" },
  ],
};

export const WEEKLY_PHYSICAL = [
  { day: "M", value: 88 },
  { day: "T", value: 72 },
  { day: "W", value: 100 },
  { day: "T", value: 64 },
  { day: "F", value: 92 },
  { day: "S", value: 40 },
  { day: "S", value: 0 },
];

// ───────────────────────────────────────────────────────────────────────────
// Recovery / post-op (cholecystectomy-specific).
// ───────────────────────────────────────────────────────────────────────────

export const REHAB_EXERCISES: RehabExercise[] = [
  {
    id: "r-walk",
    title: "Gentle corridor walks",
    detail: "Little and often prevents clots and chest infection",
    sets: "5 walks × 5 min",
    done: false,
  },
  {
    id: "r-breath",
    title: "Deep breathing + incentive spirometry",
    detail: "Keeps the lung bases open after anaesthetic",
    sets: "10 breaths, hourly",
    done: false,
  },
  {
    id: "r-shoulder",
    title: "Seated shoulder rolls",
    detail: "Eases referred shoulder-tip pain from CO₂ gas",
    sets: "2 × 10",
    done: false,
  },
  {
    id: "r-sitstand",
    title: "Brace-and-rise sit-to-stand",
    detail: "Gently support your tummy as you stand",
    sets: "2 × 8",
    done: false,
  },
];

export const RECOVERY_SYMPTOMS: RecoverySymptom[] = [
  { id: "s-shoulder", label: "Mild right-shoulder ache", escalates: false, icon: "breathing" },
  { id: "s-tired", label: "Mild fatigue", escalates: false, icon: "sleep" },
  { id: "s-bruise", label: "Light bruising near a port site", escalates: false, icon: "wound" },
  { id: "s-fever", label: "Fever above 38°C", escalates: true, icon: "fever" },
  { id: "s-wound", label: "Increasing wound redness or discharge", escalates: true, icon: "wound" },
  { id: "s-abdo", label: "Worsening abdominal pain", escalates: true, icon: "nausea" },
  { id: "s-breath", label: "Shortness of breath", escalates: true, icon: "breath" },
  { id: "s-vomit", label: "Persistent nausea or vomiting", escalates: true, icon: "nausea" },
];

// ───────────────────────────────────────────────────────────────────────────
// Clinician roster — 6 patients, deterministic, varied risk profiles.
// ───────────────────────────────────────────────────────────────────────────

interface PatientSeed {
  id: string;
  name: string;
  age: number;
  sex: "F" | "M";
  procedure: string;
  daysToSurgery: number;
  pillars: PillarScores;
  trend: number[];
  screenings: ScreeningResult[];
  alerts: PatientAlert[];
  avatarHue: number;
}

function buildPatient(seed: PatientSeed): Patient {
  const readiness = compositeReadiness(seed.pillars);
  return {
    ...seed,
    readiness,
    risk: riskFromReadiness(readiness),
    phase: seed.daysToSurgery < 0 ? "recovery" : "prehab",
  };
}

const PATIENT_SEEDS: PatientSeed[] = [
  {
    id: "p-reyes",
    name: "Sofia Reyes",
    age: 58,
    sex: "F",
    procedure: "Laparoscopic Cholecystectomy",
    daysToSurgery: -3,
    avatarHue: 8,
    pillars: { nutrition: 70, physical: 60, mental: 72 },
    trend: [64, 66, 69, 71, 73, 70, 68, 67],
    screenings: [
      {
        tool: "MUST",
        fullName: "Malnutrition Universal Screening Tool",
        scoreLabel: "Score 1 / 6",
        interpretation: "Medium risk — monitor intake, dietitian on standby.",
        severity: "watch",
        pillar: "nutrition",
      },
      {
        tool: "DASI",
        fullName: "Duke Activity Status Index",
        scoreLabel: "34 pts · ~6.1 METs",
        interpretation: "Adequate functional capacity pre-op.",
        severity: "good",
        pillar: "physical",
      },
      {
        tool: "PHQ-9",
        fullName: "Patient Health Questionnaire",
        scoreLabel: "Score 6 / 27",
        interpretation: "Mild — supportive monitoring.",
        severity: "watch",
        pillar: "mental",
      },
      {
        tool: "GAD-7",
        fullName: "Generalised Anxiety Disorder scale",
        scoreLabel: "Score 5 / 21",
        interpretation: "Mild anxiety — within expected range.",
        severity: "good",
        pillar: "mental",
      },
    ],
    alerts: [
      {
        id: "a-reyes-1",
        title: "Possible surgical site infection",
        detail:
          "Post-op day 3: rising wound erythema at the umbilical port with low-grade fever (37.9°C) and a pain score climbing 6 → 8 / 10. Pattern consistent with early SSI.",
        severity: "concern",
        loggedAt: "Today, 08:12",
        requiresDecision: true,
      },
      {
        id: "a-reyes-2",
        title: "Pain trending upward",
        detail: "Self-reported pain 6 → 8 / 10 over 24h despite regular analgesia.",
        severity: "watch",
        loggedAt: "Today, 07:55",
        requiresDecision: false,
      },
    ],
  },
  {
    id: "p-bell",
    name: "Marcus Bell",
    age: 72,
    sex: "M",
    procedure: "Open AAA Repair",
    daysToSurgery: 9,
    avatarHue: 210,
    pillars: { nutrition: 52, physical: 44, mental: 58 },
    trend: [40, 41, 43, 45, 44, 47, 49, 50],
    screenings: [
      {
        tool: "MUST",
        fullName: "Malnutrition Universal Screening Tool",
        scoreLabel: "Score 2 / 6",
        interpretation: "High risk — dietitian referral, oral nutrition support started.",
        severity: "concern",
        pillar: "nutrition",
      },
      {
        tool: "DASI",
        fullName: "Duke Activity Status Index",
        scoreLabel: "19 pts · ~3.6 METs",
        interpretation: "Poor functional capacity — elevated perioperative risk.",
        severity: "concern",
        pillar: "physical",
      },
      {
        tool: "PHQ-9",
        fullName: "Patient Health Questionnaire",
        scoreLabel: "Score 11 / 27",
        interpretation: "Moderate depression — psychology referral made.",
        severity: "concern",
        pillar: "mental",
      },
      {
        tool: "GAD-7",
        fullName: "Generalised Anxiety Disorder scale",
        scoreLabel: "Score 9 / 21",
        interpretation: "Mild–moderate anxiety.",
        severity: "watch",
        pillar: "mental",
      },
    ],
    alerts: [],
  },
  {
    id: "p-oconnor",
    name: "James O'Connor",
    age: 61,
    sex: "M",
    procedure: "Coronary Artery Bypass Graft",
    daysToSurgery: 5,
    avatarHue: 28,
    pillars: { nutrition: 64, physical: 56, mental: 55 },
    trend: [50, 52, 51, 54, 55, 57, 56, 58],
    screenings: [
      {
        tool: "MUST",
        fullName: "Malnutrition Universal Screening Tool",
        scoreLabel: "Score 1 / 6",
        interpretation: "Medium risk — protein-forward plan in place.",
        severity: "watch",
        pillar: "nutrition",
      },
      {
        tool: "DASI",
        fullName: "Duke Activity Status Index",
        scoreLabel: "26 pts · ~4.7 METs",
        interpretation: "Reduced capacity — supervised prehab.",
        severity: "watch",
        pillar: "physical",
      },
      {
        tool: "PHQ-9",
        fullName: "Patient Health Questionnaire",
        scoreLabel: "Score 9 / 27",
        interpretation: "Mild–moderate — review before surgery.",
        severity: "watch",
        pillar: "mental",
      },
      {
        tool: "GAD-7",
        fullName: "Generalised Anxiety Disorder scale",
        scoreLabel: "Score 11 / 21",
        interpretation: "Moderate anxiety — guided relaxation prescribed.",
        severity: "concern",
        pillar: "mental",
      },
    ],
    alerts: [],
  },
  {
    id: "p-hayes",
    name: "Eleanor Hayes",
    age: 67,
    sex: "F",
    procedure: "Laparoscopic Cholecystectomy",
    daysToSurgery: 21,
    avatarHue: 320,
    pillars: { nutrition: 78, physical: 60, mental: 74 },
    trend: [58, 60, 62, 63, 66, 67, 69, 70],
    screenings: [
      {
        tool: "MUST",
        fullName: "Malnutrition Universal Screening Tool",
        scoreLabel: "Score 1 / 6",
        interpretation: "Medium risk — intake improving week-on-week.",
        severity: "watch",
        pillar: "nutrition",
      },
      {
        tool: "DASI",
        fullName: "Duke Activity Status Index",
        scoreLabel: "31 pts · ~5.6 METs",
        interpretation: "Borderline capacity — responding well to prehab.",
        severity: "watch",
        pillar: "physical",
      },
      {
        tool: "PHQ-9",
        fullName: "Patient Health Questionnaire",
        scoreLabel: "Score 4 / 27",
        interpretation: "Minimal — no action needed.",
        severity: "good",
        pillar: "mental",
      },
      {
        tool: "GAD-7",
        fullName: "Generalised Anxiety Disorder scale",
        scoreLabel: "Score 6 / 21",
        interpretation: "Mild anxiety — settling with breathing work.",
        severity: "good",
        pillar: "mental",
      },
    ],
    alerts: [],
  },
  {
    id: "p-nair",
    name: "Priya Nair",
    age: 54,
    sex: "F",
    procedure: "Laparoscopic Colectomy",
    daysToSurgery: 21,
    avatarHue: 158,
    pillars: { nutrition: 86, physical: 82, mental: 80 },
    trend: [72, 74, 76, 78, 79, 81, 82, 83],
    screenings: [
      {
        tool: "MUST",
        fullName: "Malnutrition Universal Screening Tool",
        scoreLabel: "Score 0 / 6",
        interpretation: "Low risk — routine care.",
        severity: "good",
        pillar: "nutrition",
      },
      {
        tool: "DASI",
        fullName: "Duke Activity Status Index",
        scoreLabel: "47 pts · ~8.2 METs",
        interpretation: "Excellent functional capacity.",
        severity: "good",
        pillar: "physical",
      },
      {
        tool: "PHQ-9",
        fullName: "Patient Health Questionnaire",
        scoreLabel: "Score 2 / 27",
        interpretation: "Minimal — no action needed.",
        severity: "good",
        pillar: "mental",
      },
      {
        tool: "GAD-7",
        fullName: "Generalised Anxiety Disorder scale",
        scoreLabel: "Score 3 / 21",
        interpretation: "Minimal anxiety.",
        severity: "good",
        pillar: "mental",
      },
    ],
    alerts: [],
  },
  {
    id: "p-whitman",
    name: "David Whitman",
    age: 49,
    sex: "M",
    procedure: "Sleeve Gastrectomy",
    daysToSurgery: 28,
    avatarHue: 188,
    pillars: { nutrition: 60, physical: 70, mental: 66 },
    trend: [54, 55, 58, 60, 62, 63, 65, 66],
    screenings: [
      {
        tool: "MUST",
        fullName: "Malnutrition Universal Screening Tool",
        scoreLabel: "Score 1 / 6",
        interpretation: "Medium risk — pre-op low-calorie liver-shrink diet.",
        severity: "watch",
        pillar: "nutrition",
      },
      {
        tool: "DASI",
        fullName: "Duke Activity Status Index",
        scoreLabel: "38 pts · ~6.8 METs",
        interpretation: "Good capacity — maintain through surgery.",
        severity: "good",
        pillar: "physical",
      },
      {
        tool: "PHQ-9",
        fullName: "Patient Health Questionnaire",
        scoreLabel: "Score 5 / 27",
        interpretation: "Mild — supportive monitoring.",
        severity: "watch",
        pillar: "mental",
      },
      {
        tool: "GAD-7",
        fullName: "Generalised Anxiety Disorder scale",
        scoreLabel: "Score 4 / 21",
        interpretation: "Minimal anxiety.",
        severity: "good",
        pillar: "mental",
      },
    ],
    alerts: [],
  },
];

export const PATIENTS: Patient[] = PATIENT_SEEDS.map(buildPatient);
