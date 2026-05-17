import { AdminLink } from "@/components/admin/AdminLink";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminProducts } from "@/lib/admin/repositories/products";
import { archiveProductAction, toggleProductFeaturedAction } from "@/app/admin/products/actions";

import { AdminActionButton } from "@/components/admin/AdminActionButton";
export const metadata = createAdminMetadata("Products");
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {

  const result = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageIntro title="Products" description="Manage store products without delivery or payment actions." />
        <div className="flex gap-2">
          <AdminLink className="rounded-md border border-white/10 px-4 py-3 text-sm font-black text-white hover:border-orange-300" href="/admin/products/categories">Categories</AdminLink>
          <AdminLink className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black hover:bg-orange-400" href="/admin/products/new">New</AdminLink>
        </div>
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Product rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "title", header: "Title", render: (row) => row.title },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "category", header: "Category", render: (row) => row.category },
          { key: "type", header: "Type", render: (row) => row.type },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "price", header: "Price", render: (row) => `${row.priceRub} RUB${row.priceEur ? ` / ${row.priceEur} EUR` : ""}` },
          { key: "featured", header: "Featured", render: (row) => String(row.isFeatured) },
          { key: "edit", header: "Edit", render: (row) => <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/products/${row.id}/edit`}>Edit</AdminLink> },
          { key: "toggle", header: "Featured", render: (row) => <AdminActionButton action={toggleProductFeaturedAction} fields={{ id: row.id }}>{row.isFeatured ? "Unfeature" : "Feature"}</AdminActionButton> },
          { key: "archive", header: "Archive", render: (row) => <AdminActionButton action={archiveProductAction} fields={{ id: row.id }}>Archive</AdminActionButton> }
        ]}
        rows={result.data}
      />
    </div>
  );
}

function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-3xl font-black text-white">{title}</h1>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
