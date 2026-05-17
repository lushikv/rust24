import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { ProductCategoryForm } from "@/app/admin/products/ProductCategoryForm";

export const metadata = createAdminMetadata("New Product Category");

export default async function NewProductCategoryPage() {
  return <AdminFormShell title="New product category" description="Create a store category." backHref="/admin/products/categories"><ProductCategoryForm /></AdminFormShell>;
}
