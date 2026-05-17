import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/app/admin/products/ProductForm";

type PageProps = { params: Promise<{ productId: string }> };
export const metadata = createAdminMetadata("Edit Product");

export default async function EditProductPage({ params }: PageProps) {
  const { productId } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId }, include: { translations: true } }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } })
  ]);
  if (!product) notFound();
  return <AdminFormShell title="Edit product" description="Update product content and translations." backHref="/admin/products"><ProductForm product={product} categories={categories} /></AdminFormShell>;
}
