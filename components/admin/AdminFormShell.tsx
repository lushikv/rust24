import Link from "next/link";
import type { ReactNode } from "react";

export function AdminFormShell({
  title,
  description,
  backHref,
  children
}: {
  title: string;
  description: string;
  backHref: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Link className="text-sm font-bold text-orange-300 hover:text-orange-200" href={backHref}>
          Back
        </Link>
        <h1 className="mt-3 text-3xl font-black text-white">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
      </div>
      <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
        {children}
      </div>
    </div>
  );
}
