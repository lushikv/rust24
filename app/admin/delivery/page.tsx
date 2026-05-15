import Link from "next/link";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getAdminDeliveryJobs } from "@/lib/admin/repositories/delivery";

export const metadata = createAdminMetadata("Delivery");
export const dynamic = "force-dynamic";

function shortId(id: string) {
  return id.slice(0, 8);
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminDeliveryPage() {
  const access = await getAdminAccess("delivery");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  const result = await getAdminDeliveryJobs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Delivery</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          View delivery queue skeleton jobs. Stage 12 is dry-run only: no RCON commands,
          no item grants, and no product delivery side effects.
        </p>
      </div>
      {!result.available ? (
        <AdminStatusNotice message="Database is unavailable. Delivery rows cannot be loaded." />
      ) : null}
      <AdminDataTable
        columns={[
          {
            key: "id",
            header: "ID",
            render: (row) => (
              <Link className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/delivery/${row.id}`}>
                {shortId(row.id)}
              </Link>
            )
          },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "target", header: "Target", render: (row) => row.target },
          { key: "product", header: "Product", render: (row) => row.productTitle },
          { key: "order", header: "Order", render: (row) => shortId(row.orderId) },
          { key: "user", header: "User", render: (row) => row.user },
          { key: "steam", header: "Steam ID", render: (row) => row.steamId ?? "-" },
          { key: "qty", header: "Qty", render: (row) => row.quantity },
          { key: "created", header: "Created", render: (row) => formatDate(row.createdAt) },
          { key: "available", header: "Available", render: (row) => formatDate(row.availableAfter) },
          { key: "attempt", header: "Latest attempt", render: (row) => row.latestAttempt ?? "-" }
        ]}
        rows={result.data}
        emptyTitle="No delivery jobs"
        emptyDescription="Delivery jobs will be created only by explicit future payment-confirmed or admin flows."
      />
    </div>
  );
}
