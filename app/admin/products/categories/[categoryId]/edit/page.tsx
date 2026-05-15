import { notFound } from "next/navigation";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ProductCategoryForm } from "@/app/admin/products/ProductCategoryForm";

type PageProps = { params: Promise<{ categoryId: string }> };
export const metadata = createAdminMetadata("Edit Product Category");

export default async function EditProductCategoryPage({ params }: PageProps) {
  const access = await getAdminAccess("products");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const { categoryId } = await params;
  const category = await prisma.productCategory.findUnique({ where: { id: categoryId } });
  if (!category) notFound();
  return <AdminFormShell title="Edit product category" description="Update category content." backHref="/admin/products/categories"><ProductCategoryForm category={category} /></AdminFormShell>;
}
