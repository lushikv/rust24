import type { ReactNode } from "react";

export function Section({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`py-10 sm:py-12 ${className}`}>{children}</section>;
}
