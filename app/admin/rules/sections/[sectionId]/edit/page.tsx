import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { RuleSectionForm } from "@/app/admin/rules/RuleForms";

type PageProps = { params: Promise<{ sectionId: string }> };
export const metadata = createAdminMetadata("Edit Rule Section");
export default async function EditRuleSectionPage({ params }: PageProps) {
  const { sectionId } = await params;
  const section = await prisma.ruleSection.findUnique({ where: { id: sectionId } });
  if (!section) notFound();
  return <AdminFormShell title="Edit rule section" description="Update rule section." backHref="/admin/rules"><RuleSectionForm section={section} /></AdminFormShell>;
}
