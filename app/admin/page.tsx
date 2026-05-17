import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminPopularProductCard } from "@/components/admin/AdminPopularProductCard";
import { AdminRevenueChart } from "@/components/admin/AdminRevenueChart";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAnalytics } from "@/lib/admin/repositories/analytics";
import { getAdminDashboard } from "@/lib/admin/repositories/dashboard";

export const metadata = createAdminMetadata("Dashboard");
export const dynamic = "force-dynamic";

function shortId(id: string) {
  return id.slice(0, 8);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const [result, analyticsResult] = await Promise.all([
    getAdminDashboard(),
    getAdminAnalytics()
  ]);
  const { data } = result;
  const analytics = analyticsResult.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-400">
          View-only operational overview for the current project data.
        </p>
      </div>
      {!result.available ? (
        <AdminStatusNotice message="Database is unavailable. Admin data is hidden until PostgreSQL is configured and reachable." />
      ) : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="Users" value={data.stats.totalUsers} />
        <AdminStatCard label="Active servers" value={data.stats.activeServers} />
        <AdminStatCard label="Active products" value={data.stats.activeProducts} />
        <AdminStatCard label="Draft/pending orders" value={data.stats.draftPendingOrders} />
        <AdminStatCard label="Active bans" value={data.stats.activeBans} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <AdminStatCard label="Database" value={data.dbStatus} />
        <AdminStatCard label="Redis" value={data.redisStatus} />
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <AdminMetricCard
          label="Revenue 24h"
          value={`${analytics.revenueLast24HoursRub} RUB`}
          hint={analytics.emptyReason}
        />
        <AdminPopularProductCard
          title="Popular product overall"
          product={analytics.popularProductOverall}
        />
        <AdminPopularProductCard
          title="Popular product today"
          product={analytics.popularProductToday}
        />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <AdminRevenueChart
          points={analytics.monthlyProfit}
          emptyReason={analytics.emptyReason}
        />
        <div className="space-y-3">
          <h2 className="text-xl font-black text-white">Product momentum</h2>
          <AdminPopularProductCard
            title="Popular product this month"
            product={analytics.popularProductThisMonth}
          />
          {!analytics.revenueAnalyticsAvailable ? (
            <AdminEmptyState
              title="No fake revenue"
              description="RUST24 does not have a verified paid/succeeded payment state yet, so dashboard analytics intentionally avoid simulated revenue."
            />
          ) : null}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-black text-white">Payments by status</h2>
        {data.paymentsByStatus.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {data.paymentsByStatus.map((item) => (
              <AdminStatCard key={item.status} label={item.status} value={item.count} />
            ))}
          </div>
        ) : (
          <AdminEmptyState title="No payments" description="No payment records are available." />
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-black text-white">Latest orders</h2>
        <AdminDataTable
          columns={[
            { key: "id", header: "ID", render: (row) => shortId(row.id) },
            { key: "user", header: "User", render: (row) => row.user },
            { key: "status", header: "Status", render: (row) => row.status },
            { key: "total", header: "Total", render: (row) => `${row.totalRub} ${row.currency}` },
            { key: "created", header: "Created", render: (row) => formatDate(row.createdAt) }
          ]}
          rows={data.latestOrders}
        />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-black text-white">Latest audit logs</h2>
        <AdminDataTable
          columns={[
            { key: "action", header: "Action", render: (row) => row.action },
            { key: "entity", header: "Entity", render: (row) => row.entityType },
            { key: "user", header: "User", render: (row) => row.user },
            { key: "created", header: "Created", render: (row) => formatDate(row.createdAt) }
          ]}
          rows={data.latestAuditLogs}
        />
      </section>
    </div>
  );
}
