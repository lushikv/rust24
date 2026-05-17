import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { StaticPageForm } from "@/app/admin/static-pages/StaticPageForm";

export const metadata = createAdminMetadata("New Static Page");

export default async function NewStaticPagePage() {
  return (
    <AdminFormShell
      title="New static page"
      description="Create a localized plain-text page. Publish only when the content is ready."
      backHref="/admin/static-pages"
    >
      <StaticPageForm />
    </AdminFormShell>
  );
}
