import { notFound } from "next/navigation";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getAdminDeliveryJob } from "@/lib/admin/repositories/delivery";

type PageProps = {
  params: Promise<{ jobId: string }>;
};

export const metadata = createAdminMetadata("Delivery Job");
export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminDeliveryDetailPage({ params }: PageProps) {
  const access = await getAdminAccess("delivery");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  const { jobId } = await params;
  const result = await getAdminDeliveryJob(jobId);

  if (!result.available) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-black text-white">Delivery job</h1>
        <AdminStatusNotice message="Database is unavailable. Delivery job details cannot be loaded." />
      </div>
    );
  }

  if (!result.data) {
    notFound();
  }

  const job = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Delivery job</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Dry-run only. Real RCON delivery is not implemented.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <Info label="Status" value={job.status} />
        <Info label="Target" value={job.target} />
        <Info label="Trigger" value={job.trigger} />
        <Info label="Product" value={`${job.productTitle} (${job.productSlug})`} />
        <Info label="Quantity" value={String(job.quantity)} />
        <Info label="Steam ID" value={job.steamId ?? "-"} />
        <Info label="Order ID" value={job.orderId} />
        <Info label="Available after" value={formatDate(job.availableAfter)} />
      </section>
      {job.commandPreview ? (
        <pre className="overflow-x-auto rounded-md border border-orange-500/20 bg-black/30 p-4 text-sm text-orange-100">
          {job.commandPreview}
        </pre>
      ) : null}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-white">Attempts</h2>
        <AdminDataTable
          columns={[
            { key: "status", header: "Status", render: (row) => row.status },
            { key: "message", header: "Message", render: (row) => row.message ?? "-" },
            { key: "started", header: "Started", render: (row) => formatDate(row.startedAt) },
            { key: "finished", header: "Finished", render: (row) => formatDate(row.finishedAt) }
          ]}
          rows={job.attempts ?? []}
          emptyTitle="No attempts"
          emptyDescription="No delivery attempt has been recorded for this job."
        />
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-white">{value}</p>
    </div>
  );
}
