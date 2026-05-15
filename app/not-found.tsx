import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#08090d] text-white">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-6 px-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">404</p>
          <h1 className="text-4xl font-black">Page not found</h1>
          <p className="max-w-xl text-base leading-7 text-zinc-300">
            This page does not exist or is no longer available. No private data
            or technical details are exposed here.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-md bg-orange-500 px-4 py-2 text-sm font-black text-black" href="/ru">
              Home
            </Link>
            <Link className="rounded-md border border-white/15 px-4 py-2 text-sm font-black text-white" href="/ru/store">
              Store
            </Link>
            <Link className="rounded-md border border-white/15 px-4 py-2 text-sm font-black text-white" href="/ru/support">
              Support
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
