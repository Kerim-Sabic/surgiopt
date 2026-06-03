"use client";

import { MotionConfig } from "framer-motion";
import { PatientProvider } from "@/lib/store";
import { DemoShell } from "@/components/shell/DemoShell";

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <PatientProvider>
        <main className="min-h-screen">
          <DemoShell />
        </main>
      </PatientProvider>
    </MotionConfig>
  );
}
