import Link from "next/link";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { toggleProductCategoryActiveAction } from "@/app/admin/products/actions";

export const metadata = createAdminMetadata("Product Categories");
export const dynamic = "force-dynamic";

export default async function ProductCategoriesPage() {
  const access = await getAdminAccess("products");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const rows = await prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <div><h1 className="text-3xl font-black text-white">Product categories</h1><p className="mt-2 text-sm text-zinc-400">Manage store category records.</p></div>
        <Link className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black hover:bg-orange-400" href="/admin/products/categories/new">New</Link>
      </div>
      <AdminDataTable columns={[
        { key: "title", header: "Title", render: (row) => row.titleEn },
        { key: "slug", header: "Slug", render: (row) => row.slug },
        { key: "active", header: "Active", render: (row) => String(row.isActive) },
        { key: "edit", header: "Edit", render: (row) => <Link className="font-bold text-orange-300" href={`/admin/products/categories/${row.id}/edit`}>Edit</Link> },
        { key: "toggle", header: "Toggle", render: (row) => <AdminActionButton action={toggleProductCategoryActiveAction} fields={{ id: row.id }}>{row.isActive ? "Deactivate" : "Activate"}</AdminActionButton> }
      ]} rows={rows} />
    </div>
  );
}
