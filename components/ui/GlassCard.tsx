"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLMotionProps<"div"> & {
  /** Adds the soft top sheen highlight. */
  sheen?: boolean;
};

/** Frosted translucent surface with layered depth. */
export function GlassCard({
  className,
  sheen = true,
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass rounded-3xl shadow-glass",
        sheen && "card-sheen",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
