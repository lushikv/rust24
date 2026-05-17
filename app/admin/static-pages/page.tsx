import { AdminLink } from "@/components/admin/AdminLink";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminStaticPages } from "@/lib/admin/repositories/static-pages";

export const metadata = createAdminMetadata("Static Pages");
export const dynamic = "force-dynamic";

export default async function AdminStaticPagesPage() {
  const result = await getAdminStaticPages();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Static Pages</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Manage localized informational pages with plain text content and safe indexation controls.
          </p>
        </div>
        <AdminLink
          className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black hover:bg-orange-400"
          href="/admin/static-pages/new"
        >
          New page
        </AdminLink>
      </div>
      {!result.available ? (
        <AdminStatusNotice message="Database is unavailable. Static pages cannot be loaded." />
      ) : null}
      <AdminDataTable
        columns={[
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "ru", header: "RU title", render: (row) => row.titleRu },
          { key: "en", header: "EN title", render: (row) => row.titleEn },
          {
            key: "published",
            header: "Published",
            render: (row) => <AdminStatusBadge tone={row.isPublished ? "green" : "zinc"}>{row.isPublished ? "Published" : "Draft"}</AdminStatusBadge>
          },
          {
            key: "index",
            header: "Indexing",
            render: (row) => <AdminStatusBadge tone={row.noindex ? "orange" : "green"}>{row.noindex ? "Noindex" : "Indexable"}</AdminStatusBadge>
          },
          { key: "updated", header: "Updated", render: (row) => new Date(row.updatedAt).toLocaleString("en-GB") },
          {
            key: "public",
            header: "Public",
            render: (row) =>
              row.isPublished ? (
                <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={`/ru/pages/${row.slug}`}>
                  Open
                </AdminLink>
              ) : (
                <span className="text-zinc-500">Draft</span>
              )
          },
          {
            key: "edit",
            header: "Edit",
            render: (row) => (
              <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/static-pages/${row.id}/edit`}>
                Edit
              </AdminLink>
            )
          }
        ]}
        rows={result.data}
        emptyTitle="No static pages"
        emptyDescription="Create a page when legal, help, or project information needs to be managed from admin."
      />
    </div>
  );
}
