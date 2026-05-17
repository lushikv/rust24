import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { BanForm } from "@/app/admin/bans/BanForm";

export const metadata = createAdminMetadata("New Ban");
export default async function NewBanPage() {
  return <AdminFormShell title="New ban" description="Create a ban record." backHref="/admin/bans"><BanForm /></AdminFormShell>;
}
