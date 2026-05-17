import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminStaticPage } from "@/lib/admin/repositories/static-pages";
import { StaticPageForm } from "@/app/admin/static-pages/StaticPageForm";

type PageProps = {
  params: Promise<{ pageId: string }>;
};

export const metadata = createAdminMetadata("Edit Static Page");

export default async function EditStaticPagePage({ params }: PageProps) {
  const { pageId } = await params;
  const result = await getAdminStaticPage(pageId);

  if (!result.available) {
    return <AdminStatusNotice message="Database is unavailable. Static page editing cannot be loaded." />;
  }

  if (!result.data) {
    notFound();
  }

  return (
    <AdminFormShell
      title="Edit static page"
      description="Update localized content, publication status, and indexation rules."
      backHref="/admin/static-pages"
    >
      <StaticPageForm page={result.data} />
    </AdminFormShell>
  );
}
