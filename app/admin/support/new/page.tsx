import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { SupportForm } from "@/app/admin/support/SupportForm";

export const metadata = createAdminMetadata("New Support Channel");
export default async function NewSupportPage() {
  return <AdminFormShell title="New support channel" description="Create support channel." backHref="/admin/support"><SupportForm /></AdminFormShell>;
}
