import { AdminLink } from "@/components/admin/AdminLink";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminPaymentSystems } from "@/lib/admin/repositories/payment-settings";

export const metadata = createAdminMetadata("Payment Systems");
export const dynamic = "force-dynamic";

export default async function AdminPaymentSystemsPage() {
  const result = await getAdminPaymentSystems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Payment Systems</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Store future provider credentials and public IDs without connecting checkout or processing real payments.
          Secrets are never displayed after saving.
        </p>
      </div>
      {!result.available ? (
        <AdminStatusNotice message="Database is unavailable. Provider settings are shown as disabled placeholders." />
      ) : null}
      <AdminDataTable
        columns={[
          { key: "name", header: "Provider", render: (row) => row.displayName },
          {
            key: "enabled",
            header: "Enabled",
            render: (row) => <AdminStatusBadge tone={row.isEnabled ? "green" : "zinc"}>{row.isEnabled ? "Enabled" : "Disabled"}</AdminStatusBadge>
          },
          {
            key: "secret",
            header: "Secrets",
            render: (row) => <AdminStatusBadge tone={row.configured ? "green" : "orange"}>{row.configured ? "Configured" : "Missing"}</AdminStatusBadge>
          },
          {
            key: "public",
            header: "Public config",
            render: (row) => {
              const keys = Object.entries(row.publicConfig).filter(([, value]) => value !== "" && value !== false);
              return keys.length ? keys.map(([key]) => key).join(", ") : "None";
            }
          },
          { key: "updated", header: "Updated", render: (row) => row.updatedAt ? new Date(row.updatedAt).toLocaleString("en-GB") : "Never" },
          {
            key: "edit",
            header: "Edit",
            render: (row) => (
              <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/payment-systems/${row.provider}/edit`}>
                Edit
              </AdminLink>
            )
          }
        ]}
        rows={result.data}
      />
      <AdminStatusNotice message="These settings are configuration-only. Checkout still uses the existing disabled/mock payment abstraction and cannot process real money." />
    </div>
  );
}
