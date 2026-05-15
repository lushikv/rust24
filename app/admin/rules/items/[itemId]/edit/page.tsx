import { notFound } from "next/navigation";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { RuleItemForm } from "@/app/admin/rules/RuleForms";

type PageProps = { params: Promise<{ itemId: string }> };
export const metadata = createAdminMetadata("Edit Rule Item");
export default async function EditRuleItemPage({ params }: PageProps) {
  const access = await getAdminAccess("rules");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const { itemId } = await params;
  const [item, sections] = await Promise.all([
    prisma.ruleItem.findUnique({ where: { id: itemId } }),
    prisma.ruleSection.findMany({ orderBy: { sortOrder: "asc" } })
  ]);
  if (!item) notFound();
  return <AdminFormShell title="Edit rule item" description="Update rule item." backHref="/admin/rules"><RuleItemForm item={item} sections={sections} /></AdminFormShell>;
}
