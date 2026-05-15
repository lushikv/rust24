import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { FAQCategoryForm } from "@/app/admin/faq/FAQForms";

export const metadata = createAdminMetadata("New FAQ Category");
export default async function NewFAQCategoryPage() {
  const access = await getAdminAccess("faq");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  return <AdminFormShell title="New FAQ category" description="Create a FAQ category." backHref="/admin/faq/categories"><FAQCategoryForm /></AdminFormShell>;
}
