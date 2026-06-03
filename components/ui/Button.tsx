"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-clinical-500 to-clinical-600 text-white shadow-ring hover:from-clinical-400 hover:to-clinical-600",
  secondary:
    "glass text-ink shadow-glass-sm hover:bg-white/80",
  ghost: "text-ink-soft hover:bg-ink/5",
  danger:
    "bg-gradient-to-b from-risk to-risk-deep text-white shadow-[0_10px_30px_-12px_rgba(200,74,62,0.6)]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-xl",
  md: "h-11 px-5 text-[15px] rounded-2xl",
  lg: "h-[52px] px-6 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", iconLeft, iconRight, fullWidth, className, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "press focus-ring inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </button>
    );
  },
);
