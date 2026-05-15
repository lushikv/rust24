import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/app/admin/products/ProductForm";

export const metadata = createAdminMetadata("New Product");

export default async function NewProductPage() {
  const access = await getAdminAccess("products");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const categories = await prisma.productCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return <AdminFormShell title="New product" description="Create a product with RU/EN translations." backHref="/admin/products"><ProductForm categories={categories} /></AdminFormShell>;
}
