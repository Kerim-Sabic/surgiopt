# SurgiOPT

A front-end demo for **SurgiOPT** — a surgical prehabilitation & rehabilitation
platform grounded in evidence-based perioperative optimization and ERAS
(Enhanced Recovery After Surgery) principles.

Built to reduce postoperative complications, length of stay, and 30-day
readmissions across the full surgical journey: **pre-op → surgery → post-op**.

> This is an investor / hospital-pilot demo. There is **no backend** — all data
> is mocked, deterministic, and in-memory, so every run looks identical.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

No environment variables, no database, no config. It boots on first run.

```bash
npm run build    # production build
npm run lint     # eslint
npm run typecheck # tsc --noEmit (strict)
```

## What's in the demo

A toggle at the top switches between the two surfaces:

### 📱 Patient app (mobile-first, in an iPhone frame)
- **Onboarding** — branded splash, surgery countdown (21 days to a Laparoscopic
  Cholecystectomy).
- **Assessment** — answerable questions from real screening tools (MUST, DASI,
  6MWT proxy, PHQ-9, GAD-7) that update three readiness rings **live**.
- **Home** — three Apple-Activity-style pillar rings + a composite Surgical
  Readiness Score (0–100) with risk badge and today's plan.
- **Daily plan** — checkable tasks across all three pillars; completing them
  animates the rings upward.
- **Physical pillar** — 6-Minute Walk Test trend chart (Recharts), exercise of
  the day with a play state, weekly activity.
- **Recovery mode** — a toggle flips the whole app to post-op: a
  surgery-specific rehab plan and a daily check-in (pain scale + symptoms). Log
  an escalating symptom and the status flips to **"Flag for review."**

### 🩺 Clinician dashboard (full-width)
- **Roster** — 6 deterministic patients with varied risk profiles, sortable and
  filterable by risk, with readiness rings and trend sparklines.
- **Patient detail** — three pillar scores, validated screening results
  (MUST / DASI / PHQ-9 / GAD-7 with interpretation), a readiness trend chart, and
  a post-op alerts panel. The flagged surgical-site-infection case surfaces a
  **"Physician decision required"** call-to-action — decision support, never
  autonomous action.

## Three prehabilitation pillars

| Pillar | Screening tool | Focus |
| --- | --- | --- |
| Nutritional & Immune | MUST | Protein, hydration, micronutrients |
| Physical | DASI · 6MWT · frailty | Aerobic capacity, strength, mobility |
| Psychological Resilience | PHQ-9 · GAD-7 | Mindfulness, CBT, stress reduction |

## Tech

Next.js (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion ·
Recharts · lucide-react. `prefers-reduced-motion` is honored throughout.

## Architecture

```
app/                      Next.js App Router (layout, globals, single page)
components/
  ui/                     Reusable primitives (ReadinessRing, PhoneFrame, …)
  patient/                Patient app shell, tab bar, 6 screens, charts
  clinician/              Dashboard, roster, patient detail, alerts, charts
  shell/                  DemoShell — the Patient/Clinician surface toggle
lib/
  types.ts                Strict domain model
  mock-data.ts            Deterministic, clinically-plausible data
  store.tsx               In-memory patient state (typed React context)
  utils.ts                Scoring, risk stratification, design tokens
```
