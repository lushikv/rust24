const toneClasses = {
  zinc: "border-white/10 bg-white/[0.04] text-zinc-200",
  green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  orange: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  red: "border-red-400/30 bg-red-400/10 text-red-200"
};

export function AdminStatusBadge({
  children,
  tone = "zinc"
}: {
  children: string | boolean;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <span className={`inline-flex rounded border px-2 py-1 text-xs font-bold uppercase ${toneClasses[tone]}`}>
      {String(children)}
    </span>
  );
}
