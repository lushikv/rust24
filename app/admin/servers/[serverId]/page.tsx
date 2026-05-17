import { AdminLink } from "@/components/admin/AdminLink";
import { notFound } from "next/navigation";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminServerDetail } from "@/lib/admin/repositories/servers";

type PageProps = { params: Promise<{ serverId: string }> };

export const metadata = createAdminMetadata("Server Detail");
export const dynamic = "force-dynamic";

function shortId(id: string) {
  return id.slice(0, 8);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminServerDetailPage({ params }: PageProps) {

  const { serverId } = await params;
  const result = await getAdminServerDetail(serverId);
  if (result.available && !result.data) notFound();
  const server = result.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <AdminLink className="text-sm font-bold text-orange-300 hover:text-orange-200" href="/admin/servers">
            Back
          </AdminLink>
          <h1 className="mt-3 text-3xl font-black text-white">{server?.title ?? "Server detail"}</h1>
          <p className="mt-2 text-sm text-zinc-400">
            RCON settings are configuration-only. Password values are never displayed.
          </p>
        </div>
        {server ? (
          <AdminLink
            className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black hover:bg-orange-400"
            href={`/admin/servers/${server.id}/edit`}
          >
            Edit server
          </AdminLink>
        ) : null}
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Server detail cannot be loaded." /> : null}
      {server ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard label="Public address" value={server.publicAddress} hint={server.connectCommand} />
            <AdminMetricCard label="Status" value={server.latestStatus} hint={`${server.mode} / ${server.region}`} />
            <AdminMetricCard label="Capacity" value={server.capacity} hint={server.teamLimit} />
            <AdminMetricCard
              label="RCON"
              value={server.rconConfigured ? "Configured" : "Disabled"}
              hint={server.rconEnabled ? `${server.rconHost}:${server.rconPort}` : "RCON is not enabled."}
            />
          </section>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard label="Total earnings" value="0 RUB" hint="Revenue data will be available after real payment integration." />
            <AdminMetricCard label="Last 24 hours" value="0 RUB" hint="No verified paid status exists yet." />
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">Active</p>
              <div className="mt-3"><AdminStatusBadge>{server.isActive}</AdminStatusBadge></div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">Featured</p>
              <div className="mt-3"><AdminStatusBadge>{server.isFeatured}</AdminStatusBadge></div>
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-black text-white">Payment history</h2>
            <AdminEmptyState
              title="No revenue data"
              description="Revenue data will be available after real payment integration."
            />
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-black text-white">Products assigned to this server</h2>
            {server.productsAssigned.length ? (
              <AdminDataTable
                columns={[
                  { key: "title", header: "Product", render: (row) => row.title },
                  { key: "slug", header: "Slug", render: (row) => row.slug },
                  { key: "status", header: "Status", render: (row) => row.status }
                ]}
                rows={server.productsAssigned}
              />
            ) : (
              <AdminEmptyState
                title="No products assigned"
                description="Product-to-server assignment is empty. No product delivery or RCON behavior is available."
              />
            )}
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-black text-white">Latest delivery jobs</h2>
            <AdminDataTable
              columns={[
                { key: "id", header: "ID", render: (row) => shortId(row.id) },
                { key: "status", header: "Status", render: (row) => row.status },
                { key: "product", header: "Product", render: (row) => row.productTitle },
                { key: "quantity", header: "Qty", render: (row) => row.quantity },
                { key: "created", header: "Created", render: (row) => formatDate(row.createdAt) }
              ]}
              rows={server.latestDeliveryJobs}
            />
          </section>
        </>
      ) : null}
    </div>
  );
}
