"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { taskIcon } from "@/components/ui/icons";
import { PILLAR_META, cn } from "@/lib/utils";
import type { PlanTask } from "@/lib/types";

interface TaskRowProps {
  task: PlanTask;
  onToggle: (id: string) => void;
  index?: number;
}

export function TaskRow({ task, onToggle, index = 0 }: TaskRowProps) {
  const meta = PILLAR_META[task.pillar];
  const Icon = taskIcon(task.icon);

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onToggle(task.id)}
      className={cn(
        "press focus-ring flex w-full items-center gap-3 rounded-3xl p-3 text-left shadow-glass-sm transition-colors",
        task.done ? "bg-white/40" : "glass card-sheen",
      )}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors"
        style={{
          background: task.done ? `${meta.hex}14` : `${meta.hex}1f`,
          color: meta.deepText,
        }}
      >
        <Icon className="h-[20px] w-[20px]" strokeWidth={2.2} />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-[14px] font-semibold tracking-tight transition-colors",
            task.done ? "text-ink-faint line-through" : "text-ink",
          )}
        >
          {task.title}
        </p>
        <p className="truncate text-[12px] text-ink-muted">{task.detail}</p>
      </div>

      <span
        className="flex items-center gap-1 text-[11px] font-bold"
        style={{ color: task.done ? meta.deepText : "#9AA8B5" }}
      >
        +{task.points}
      </span>

      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          task.done ? "border-transparent" : "border-ink/15",
        )}
        style={task.done ? { background: meta.hex } : undefined}
      >
        <motion.span
          initial={false}
          animate={{ scale: task.done ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          <Check className="h-4 w-4 text-white" strokeWidth={3.5} />
        </motion.span>
      </span>
    </motion.button>
  );
}
