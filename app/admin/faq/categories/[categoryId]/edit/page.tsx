import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { FAQCategoryForm } from "@/app/admin/faq/FAQForms";

type PageProps = { params: Promise<{ categoryId: string }> };
export const metadata = createAdminMetadata("Edit FAQ Category");
export default async function EditFAQCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = await prisma.fAQCategory.findUnique({ where: { id: categoryId } });
  if (!category) notFound();
  return <AdminFormShell title="Edit FAQ category" description="Update FAQ category." backHref="/admin/faq/categories"><FAQCategoryForm category={category} /></AdminFormShell>;
}
