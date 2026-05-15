"use client";

import Link from "next/link";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="grid w-full gap-6 rounded-lg border border-white/10 bg-white/[0.03] p-8">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">Error</p>
      <h1 className="text-3xl font-black text-white">Something went wrong</h1>
      <p className="max-w-2xl text-sm leading-6 text-zinc-300">
        The page failed to load safely. Technical details are hidden from the
        browser, but the server can log the failure for operators.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-black text-black"
          onClick={() => reset()}
          type="button"
        >
          Try again
        </button>
        <Link className="rounded-md border border-white/15 px-4 py-2 text-sm font-black text-white" href="/ru/support">
          Support
        </Link>
      </div>
    </section>
  );
}
