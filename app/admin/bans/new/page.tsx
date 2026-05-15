import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { BanForm } from "@/app/admin/bans/BanForm";

export const metadata = createAdminMetadata("New Ban");
export default async function NewBanPage() {
  const access = await getAdminAccess("bans");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  return <AdminFormShell title="New ban" description="Create a ban record." backHref="/admin/bans"><BanForm /></AdminFormShell>;
}
