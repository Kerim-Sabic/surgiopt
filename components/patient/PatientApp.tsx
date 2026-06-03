"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { TabBar } from "./TabBar";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { AssessmentScreen } from "./screens/AssessmentScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { DailyPlanScreen } from "./screens/DailyPlanScreen";
import { PhysicalPillarScreen } from "./screens/PhysicalPillarScreen";
import { RecoveryScreen } from "./screens/RecoveryScreen";
import { usePatient } from "@/lib/store";
import type { PatientTab } from "@/lib/types";

const SCREENS: Record<PatientTab, () => JSX.Element> = {
  home: HomeScreen,
  plan: DailyPlanScreen,
  physical: PhysicalPillarScreen,
  recovery: RecoveryScreen,
};

const fillClass = "absolute inset-0";

export function PatientApp() {
  const { state, setView } = usePatient();

  return (
    <PhoneFrame>
      <AnimatePresence mode="wait" initial={false}>
        {state.view === "onboarding" && (
          <motion.div
            key="onboarding"
            className={fillClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <OnboardingScreen onStart={() => setView("assessment")} />
          </motion.div>
        )}

        {state.view === "assessment" && (
          <motion.div
            key="assessment"
            className={fillClass}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <AssessmentScreen onComplete={() => setView("app")} />
          </motion.div>
        )}

        {state.view === "app" && (
          <motion.div
            key="app"
            className={fillClass}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <AppTabs tab={state.tab} />
            <TabBar />
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}

function AppTabs({ tab }: { tab: PatientTab }) {
  const Screen = SCREENS[tab];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={tab}
        className={fillClass}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}
