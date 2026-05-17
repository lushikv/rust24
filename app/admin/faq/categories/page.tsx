import { AdminLink } from "@/components/admin/AdminLink";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { toggleFAQCategoryActiveAction } from "@/app/admin/faq/actions";

export const metadata = createAdminMetadata("FAQ Categories");
export const dynamic = "force-dynamic";

export default async function FAQCategoriesPage() {
  const rows = await prisma.fAQCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4"><h1 className="text-3xl font-black text-white">FAQ categories</h1><AdminLink className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black" href="/admin/faq/categories/new">New</AdminLink></div>
      <AdminDataTable columns={[
        { key: "title", header: "Title", render: (row) => row.titleEn },
        { key: "slug", header: "Slug", render: (row) => row.slug },
        { key: "active", header: "Active", render: (row) => String(row.isActive) },
        { key: "edit", header: "Edit", render: (row) => <AdminLink className="font-bold text-orange-300" href={`/admin/faq/categories/${row.id}/edit`}>Edit</AdminLink> },
        { key: "toggle", header: "Toggle", render: (row) => <AdminActionButton action={toggleFAQCategoryActiveAction} fields={{ id: row.id }}>{row.isActive ? "Deactivate" : "Activate"}</AdminActionButton> }
      ]} rows={rows} />
    </div>
  );
}
