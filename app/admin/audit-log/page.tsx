import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getAdminAuditLogs } from "@/lib/admin/repositories/audit-log";

export const metadata = createAdminMetadata("Audit Log");
export const dynamic = "force-dynamic";

function shortValue(value: string | null) {
  return value ? value.slice(0, 10) : "-";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminAuditLogPage() {
  const access = await getAdminAccess("auditLog");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  const result = await getAdminAuditLogs();

  return (
    <div className="space-y-6">
      <PageIntro title="Audit Log" description="Latest operational audit events." />
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Audit rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "action", header: "Action", render: (row) => row.action },
          { key: "entity", header: "Entity", render: (row) => row.entityType },
          { key: "entityId", header: "Entity ID", render: (row) => shortValue(row.entityId) },
          { key: "user", header: "User", render: (row) => row.user },
          { key: "message", header: "Message", render: (row) => row.message ?? "-" },
          { key: "created", header: "Created", render: (row) => formatDate(row.createdAt) }
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
