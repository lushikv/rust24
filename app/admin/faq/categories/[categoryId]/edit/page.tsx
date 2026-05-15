import { notFound } from "next/navigation";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { FAQCategoryForm } from "@/app/admin/faq/FAQForms";

type PageProps = { params: Promise<{ categoryId: string }> };
export const metadata = createAdminMetadata("Edit FAQ Category");
export default async function EditFAQCategoryPage({ params }: PageProps) {
  const access = await getAdminAccess("faq");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const { categoryId } = await params;
  const category = await prisma.fAQCategory.findUnique({ where: { id: categoryId } });
  if (!category) notFound();
  return <AdminFormShell title="Edit FAQ category" description="Update FAQ category." backHref="/admin/faq/categories"><FAQCategoryForm category={category} /></AdminFormShell>;
}
