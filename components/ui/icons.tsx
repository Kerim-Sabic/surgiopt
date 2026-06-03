import {
  Apple,
  Droplets,
  Pill,
  Footprints,
  Dumbbell,
  Wind,
  Brain,
  Moon,
  Thermometer,
  Bandage,
  HeartPulse,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { TaskIcon } from "@/lib/types";

type IconKey = TaskIcon | "fever" | "wound" | "nausea" | "breath";

const MAP: Record<IconKey, LucideIcon> = {
  meal: Apple,
  hydration: Droplets,
  supplement: Pill,
  walk: Footprints,
  strength: Dumbbell,
  breathing: Wind,
  mindfulness: Brain,
  sleep: Moon,
  fever: Thermometer,
  wound: Bandage,
  nausea: HeartPulse,
  breath: Stethoscope,
};

export function taskIcon(key: IconKey): LucideIcon {
  return MAP[key] ?? Apple;
}
