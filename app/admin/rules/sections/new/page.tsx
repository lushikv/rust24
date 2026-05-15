import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { RuleSectionForm } from "@/app/admin/rules/RuleForms";

export const metadata = createAdminMetadata("New Rule Section");
export default async function NewRuleSectionPage() {
  const access = await getAdminAccess("rules");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  return <AdminFormShell title="New rule section" description="Create a rule section." backHref="/admin/rules"><RuleSectionForm /></AdminFormShell>;
}
