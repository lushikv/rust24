import { notFound } from "next/navigation";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { RuleSectionForm } from "@/app/admin/rules/RuleForms";

type PageProps = { params: Promise<{ sectionId: string }> };
export const metadata = createAdminMetadata("Edit Rule Section");
export default async function EditRuleSectionPage({ params }: PageProps) {
  const access = await getAdminAccess("rules");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const { sectionId } = await params;
  const section = await prisma.ruleSection.findUnique({ where: { id: sectionId } });
  if (!section) notFound();
  return <AdminFormShell title="Edit rule section" description="Update rule section." backHref="/admin/rules"><RuleSectionForm section={section} /></AdminFormShell>;
}
