import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { ProductCategoryForm } from "@/app/admin/products/ProductCategoryForm";

type PageProps = { params: Promise<{ categoryId: string }> };
export const metadata = createAdminMetadata("Edit Product Category");

export default async function EditProductCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const category = await prisma.productCategory.findUnique({ where: { id: categoryId } });
  if (!category) notFound();
  return <AdminFormShell title="Edit product category" description="Update category content." backHref="/admin/products/categories"><ProductCategoryForm category={category} /></AdminFormShell>;
}
