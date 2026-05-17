import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminOrders } from "@/lib/admin/repositories/orders";

export const metadata = createAdminMetadata("Orders");
export const dynamic = "force-dynamic";

function shortId(id: string) {
  return id.slice(0, 8);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminOrdersPage() {

  const result = await getAdminOrders();

  return (
    <div className="space-y-6">
      <PageIntro title="Orders" description="View draft and pending orders. No manual paid or delivery actions exist in Stage 12." />
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Order rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "id", header: "ID", render: (row) => shortId(row.id) },
          { key: "user", header: "User", render: (row) => row.user },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "total", header: "Total", render: (row) => `${row.totalRub} ${row.currency}` },
          { key: "created", header: "Created", render: (row) => formatDate(row.createdAt) },
          { key: "items", header: "Items", render: (row) => row.itemCount },
          { key: "delivery", header: "Delivery jobs", render: (row) => row.deliveryJobCount }
        ]}
        rows={result.data}
      />
    </div>
  );
}

function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-3xl font-black text-white">{title}</h1>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
