import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { ServerForm } from "@/app/admin/servers/ServerForm";

export const metadata = createAdminMetadata("New Server");

export default async function NewServerPage() {

  return (
    <AdminFormShell title="New server" description="Create a server record." backHref="/admin/servers">
      <ServerForm />
    </AdminFormShell>
  );
}
