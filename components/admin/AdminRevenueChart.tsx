import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

export type AdminRevenueChartPoint = {
  month: string;
  revenueRub: number;
};

export function AdminRevenueChart({
  points,
  emptyReason
}: {
  points: AdminRevenueChartPoint[];
  emptyReason: string;
}) {
  const maxRevenue = Math.max(...points.map((point) => point.revenueRub), 0);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-black text-white">Profit for the last year</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Monthly revenue chart, reserved for verified payment success data.
        </p>
      </div>
      {maxRevenue <= 0 ? (
        <AdminEmptyState title="No revenue data" description={emptyReason} />
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <div className="grid h-64 grid-cols-12 items-end gap-2">
            {points.map((point) => (
              <div key={point.month} className="flex min-h-0 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-orange-600 to-orange-200"
                  style={{ height: `${Math.max((point.revenueRub / maxRevenue) * 100, 4)}%` }}
                  title={`${point.month}: ${point.revenueRub} RUB`}
                />
                <span className="text-[10px] font-bold uppercase text-zinc-500">{point.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
