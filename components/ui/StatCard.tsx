import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <SurfaceCard className="p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-300">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-zinc-400">{detail}</p> : null}
    </SurfaceCard>
  );
}
