"use client";

import Link from "next/link";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#08090d] text-white">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-6 px-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">RUST24</p>
          <h1 className="text-4xl font-black">Application error</h1>
          <p className="max-w-xl text-base leading-7 text-zinc-300">
            The application hit a safe fallback error page. No stack trace or
            internal details are shown to visitors.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-black text-black"
              onClick={() => reset()}
              type="button"
            >
              Try again
            </button>
            <Link className="rounded-md border border-white/15 px-4 py-2 text-sm font-black text-white" href="/ru">
              Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
