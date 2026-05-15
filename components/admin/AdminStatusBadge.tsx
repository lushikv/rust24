export function AdminStatusBadge({ children }: { children: string | boolean }) {
  return (
    <span className="inline-flex rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-bold uppercase text-zinc-200">
      {String(children)}
    </span>
  );
}
