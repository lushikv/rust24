import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { RuleItemForm } from "@/app/admin/rules/RuleForms";

export const metadata = createAdminMetadata("New Rule Item");
export default async function NewRuleItemPage() {
  const access = await getAdminAccess("rules");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const sections = await prisma.ruleSection.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminFormShell title="New rule item" description="Create a rule item." backHref="/admin/rules"><RuleItemForm sections={sections} /></AdminFormShell>;
}
