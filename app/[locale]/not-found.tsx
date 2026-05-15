import Link from "next/link";

export default function LocalizedNotFound() {
  return (
    <section className="grid w-full gap-6 rounded-lg border border-white/10 bg-white/[0.03] p-8">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">404</p>
      <h1 className="text-3xl font-black text-white">Page not found / Страница не найдена</h1>
      <p className="max-w-2xl text-sm leading-6 text-zinc-300">
        The page does not exist or was moved. Use the localized links below to
        return to the public site safely.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link className="rounded-md bg-orange-500 px-4 py-2 text-sm font-black text-black" href="/ru">
          RU home
        </Link>
        <Link className="rounded-md bg-orange-500 px-4 py-2 text-sm font-black text-black" href="/en">
          EN home
        </Link>
        <Link className="rounded-md border border-white/15 px-4 py-2 text-sm font-black text-white" href="/ru/store">
          Store
        </Link>
        <Link className="rounded-md border border-white/15 px-4 py-2 text-sm font-black text-white" href="/ru/support">
          Support
        </Link>
      </div>
    </section>
  );
}
