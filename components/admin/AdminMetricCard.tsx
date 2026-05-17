export function AdminMetricCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm leading-6 text-zinc-400">{hint}</p> : null}
    </article>
  );
}
