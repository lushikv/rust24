import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "primary-cta",
  secondary: "secondary-cta",
  ghost: "focus-ring inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-black text-zinc-300 transition hover:bg-white/5 hover:text-orange-100"
} as const;

export function ButtonLink({
  children,
  className,
  variant = "primary",
  ...props
}: ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <Link className={cn(variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
