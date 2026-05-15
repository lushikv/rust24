type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function PageShell({ title, description, eyebrow }: PageShellProps) {
  return (
    <section className="w-full py-8 sm:py-14">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          {description}
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm font-bold uppercase text-orange-400">Stage</p>
          <p className="mt-2 text-2xl font-black text-white">3</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm font-bold uppercase text-orange-400">Stack</p>
          <p className="mt-2 text-2xl font-black text-white">Next.js</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm font-bold uppercase text-orange-400">Status</p>
          <p className="mt-2 text-2xl font-black text-white">Foundation</p>
        </div>
      </div>
    </section>
  );
}
