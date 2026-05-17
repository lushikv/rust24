import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { FAQCategoryForm } from "@/app/admin/faq/FAQForms";

export const metadata = createAdminMetadata("New FAQ Category");
export default async function NewFAQCategoryPage() {
  return <AdminFormShell title="New FAQ category" description="Create a FAQ category." backHref="/admin/faq/categories"><FAQCategoryForm /></AdminFormShell>;
}
