"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  ASSESSMENT_DEFAULTS,
  DAILY_PLAN,
  REHAB_EXERCISES,
  RECOVERY_SYMPTOMS,
  scorePillarFromAnswers,
} from "./mock-data";
import { clamp, compositeReadiness, riskFromReadiness } from "./utils";
import type {
  PillarKey,
  PillarScores,
  PlanTask,
  RecoveryStatus,
  RehabExercise,
  RiskLevel,
  SurgicalPhase,
  PatientTab,
  PatientView,
} from "./types";

interface State {
  view: PatientView;
  answers: Record<string, number>;
  tasks: PlanTask[];
  rehab: RehabExercise[];
  phase: SurgicalPhase;
  pain: number;
  loggedSymptoms: string[];
  tab: PatientTab;
}

type Action =
  | { type: "setView"; view: PatientView }
  | { type: "setAnswer"; questionId: string; optionIndex: number }
  | { type: "toggleTask"; taskId: string }
  | { type: "toggleRehab"; id: string }
  | { type: "setPhase"; phase: SurgicalPhase }
  | { type: "setPain"; pain: number }
  | { type: "toggleSymptom"; id: string }
  | { type: "setTab"; tab: PatientTab };

const initialState: State = {
  view: "onboarding",
  answers: { ...ASSESSMENT_DEFAULTS },
  tasks: DAILY_PLAN.map((t) => ({ ...t })),
  rehab: REHAB_EXERCISES.map((r) => ({ ...r })),
  phase: "prehab",
  pain: 2,
  loggedSymptoms: [],
  tab: "home",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setView":
      return { ...state, view: action.view };
    case "setAnswer":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.optionIndex },
      };
    case "toggleTask":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, done: !t.done } : t,
        ),
      };
    case "toggleRehab":
      return {
        ...state,
        rehab: state.rehab.map((r) =>
          r.id === action.id ? { ...r, done: !r.done } : r,
        ),
      };
    case "setPhase":
      return { ...state, phase: action.phase, tab: action.phase === "recovery" ? "recovery" : "home" };
    case "setPain":
      return { ...state, pain: action.pain };
    case "toggleSymptom":
      return {
        ...state,
        loggedSymptoms: state.loggedSymptoms.includes(action.id)
          ? state.loggedSymptoms.filter((s) => s !== action.id)
          : [...state.loggedSymptoms, action.id],
      };
    case "setTab":
      return { ...state, tab: action.tab };
    default:
      return state;
  }
}

interface PatientContextValue {
  state: State;
  // derived
  phase: SurgicalPhase;
  baselines: PillarScores;
  pillars: PillarScores;
  readiness: number;
  risk: RiskLevel;
  recoveryStatus: RecoveryStatus;
  earnedPoints: (p: PillarKey) => number;
  // actions
  setView: (view: PatientView) => void;
  setAnswer: (questionId: string, optionIndex: number) => void;
  toggleTask: (taskId: string) => void;
  toggleRehab: (id: string) => void;
  setPhase: (phase: SurgicalPhase) => void;
  togglePhase: () => void;
  setPain: (pain: number) => void;
  toggleSymptom: (id: string) => void;
  setTab: (tab: PatientTab) => void;
}

const PatientContext = createContext<PatientContextValue | null>(null);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<PatientContextValue>(() => {
    const baselines: PillarScores = {
      nutrition: scorePillarFromAnswers("nutrition", state.answers),
      physical: scorePillarFromAnswers("physical", state.answers),
      mental: scorePillarFromAnswers("mental", state.answers),
    };

    const earnedPoints = (p: PillarKey): number =>
      state.tasks
        .filter((t) => t.pillar === p && t.done)
        .reduce((sum, t) => sum + t.points, 0);

    const pillars: PillarScores = {
      nutrition: clamp(baselines.nutrition + earnedPoints("nutrition")),
      physical: clamp(baselines.physical + earnedPoints("physical")),
      mental: clamp(baselines.mental + earnedPoints("mental")),
    };

    const readiness = compositeReadiness(pillars);
    const risk = riskFromReadiness(readiness);

    const escalating = state.loggedSymptoms.some((id) => {
      const sym = RECOVERY_SYMPTOMS.find((s) => s.id === id);
      return sym?.escalates;
    });
    const recoveryStatus: RecoveryStatus =
      escalating || state.pain >= 7 ? "flag" : "on-track";

    return {
      state,
      phase: state.phase,
      baselines,
      pillars,
      readiness,
      risk,
      recoveryStatus,
      earnedPoints,
      setView: (view) => dispatch({ type: "setView", view }),
      setAnswer: (questionId, optionIndex) =>
        dispatch({ type: "setAnswer", questionId, optionIndex }),
      toggleTask: (taskId) => dispatch({ type: "toggleTask", taskId }),
      toggleRehab: (id) => dispatch({ type: "toggleRehab", id }),
      setPhase: (phase) => dispatch({ type: "setPhase", phase }),
      togglePhase: () =>
        dispatch({
          type: "setPhase",
          phase: state.phase === "prehab" ? "recovery" : "prehab",
        }),
      setPain: (pain) => dispatch({ type: "setPain", pain }),
      toggleSymptom: (id) => dispatch({ type: "toggleSymptom", id }),
      setTab: (tab) => dispatch({ type: "setTab", tab }),
    };
  }, [state]);

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
}

export function usePatient(): PatientContextValue {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return ctx;
}
