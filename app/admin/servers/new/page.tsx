import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { ServerForm } from "@/app/admin/servers/ServerForm";

export const metadata = createAdminMetadata("New Server");

export default async function NewServerPage() {
  const access = await getAdminAccess("servers");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  return (
    <AdminFormShell title="New server" description="Create a server record." backHref="/admin/servers">
      <ServerForm />
    </AdminFormShell>
  );
}
