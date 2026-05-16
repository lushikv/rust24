import type { ReactNode } from "react";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function PageHero({
  title,
  description,
  children,
  accent
}: {
  title: string;
  description: string;
  children?: ReactNode;
  accent?: string;
}) {
  return (
    <SurfaceCard className="relative overflow-hidden p-6 sm:p-8">
      <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />
      <div className="relative mx-auto max-w-3xl text-center">
        {accent ? <p className="mb-4 amber-badge">{accent}</p> : null}
        <h1 className="page-title">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
          {description}
        </p>
      </div>
      {children ? <div className="relative mt-7">{children}</div> : null}
    </SurfaceCard>
  );
}
