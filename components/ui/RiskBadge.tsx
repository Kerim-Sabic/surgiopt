import { RISK_META, cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: "sm" | "md";
  className?: string;
}

export function RiskBadge({ risk, size = "md", className }: RiskBadgeProps) {
  const meta = RISK_META[risk];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold tracking-tight",
        meta.tone,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
