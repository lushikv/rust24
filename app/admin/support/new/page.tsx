import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { SupportForm } from "@/app/admin/support/SupportForm";

export const metadata = createAdminMetadata("New Support Channel");
export default async function NewSupportPage() {
  const access = await getAdminAccess("support");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  return <AdminFormShell title="New support channel" description="Create support channel." backHref="/admin/support"><SupportForm /></AdminFormShell>;
}
