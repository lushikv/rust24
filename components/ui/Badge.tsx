import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "tactical-badge",
  amber: "amber-badge",
  success: "border-emerald-300/30 bg-emerald-400/15 text-emerald-100",
  danger: "border-red-300/30 bg-red-500/15 text-red-100",
  muted: "border-white/10 bg-white/[0.04] text-zinc-300"
} as const;

export function Badge({
  children,
  variant = "default",
  className
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        variant === "default" || variant === "amber"
          ? variants[variant]
          : "inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-black uppercase tracking-[0.14em]",
        variant !== "default" && variant !== "amber" && variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
