import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  showWordmark?: boolean;
  className?: string;
}

const MARK_SIZES = { sm: "h-7 w-7 rounded-lg", md: "h-9 w-9 rounded-xl", lg: "h-12 w-12 rounded-2xl" };
const ICON_SIZES = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };
const TEXT_SIZES = { sm: "text-base", md: "text-lg", lg: "text-2xl" };

export function Logo({
  size = "md",
  variant = "dark",
  showWordmark = true,
  className,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br from-clinical-400 to-clinical-700 text-white shadow-ring",
          MARK_SIZES[size],
        )}
      >
        <span className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/30" />
        <Activity className={ICON_SIZES[size]} strokeWidth={2.6} />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-bold tracking-tight",
            TEXT_SIZES[size],
            variant === "light" ? "text-white" : "text-ink",
          )}
        >
          Surgi
          <span className={variant === "light" ? "text-clinical-200" : "text-clinical-500"}>
            OPT
          </span>
        </span>
      )}
    </div>
  );
}
