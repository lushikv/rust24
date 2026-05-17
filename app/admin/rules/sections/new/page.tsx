import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { RuleSectionForm } from "@/app/admin/rules/RuleForms";

export const metadata = createAdminMetadata("New Rule Section");
export default async function NewRuleSectionPage() {
  return <AdminFormShell title="New rule section" description="Create a rule section." backHref="/admin/rules"><RuleSectionForm /></AdminFormShell>;
}
