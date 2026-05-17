import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/app/admin/products/ProductForm";

export const metadata = createAdminMetadata("New Product");

export default async function NewProductPage() {
  const categories = await prisma.productCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return <AdminFormShell title="New product" description="Create a product with RU/EN translations." backHref="/admin/products"><ProductForm categories={categories} /></AdminFormShell>;
}
