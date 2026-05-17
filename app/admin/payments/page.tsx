import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminPayments } from "@/lib/admin/repositories/payments";

export const metadata = createAdminMetadata("Payments");
export const dynamic = "force-dynamic";

function shortId(id: string) {
  return id.slice(0, 8);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminPaymentsPage() {

  const result = await getAdminPayments();

  return (
    <div className="space-y-6">
      <PageIntro title="Payments" description="View payment abstraction records. No provider actions or success controls are available." />
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Payment rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "id", header: "ID", render: (row) => shortId(row.id) },
          { key: "order", header: "Order", render: (row) => shortId(row.orderId) },
          { key: "provider", header: "Provider", render: (row) => row.provider },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "amount", header: "Amount", render: (row) => `${row.amountRub} ${row.currency}` },
          { key: "created", header: "Created", render: (row) => formatDate(row.createdAt) },
          { key: "attempts", header: "Attempts", render: (row) => row.attemptsCount },
          { key: "webhooks", header: "Webhooks", render: (row) => row.webhookEventsCount }
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
