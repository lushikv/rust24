import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { ProductCategoryForm } from "@/app/admin/products/ProductCategoryForm";

export const metadata = createAdminMetadata("New Product Category");

export default async function NewProductCategoryPage() {
  const access = await getAdminAccess("products");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  return <AdminFormShell title="New product category" description="Create a store category." backHref="/admin/products/categories"><ProductCategoryForm /></AdminFormShell>;
}
