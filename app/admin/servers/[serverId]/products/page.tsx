import { AdminLink } from "@/components/admin/AdminLink";
import { notFound } from "next/navigation";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminServerProductRows, getAdminServerProductFormData } from "@/lib/admin/repositories/server-products";
import { detachProductFromServerAction } from "@/app/admin/servers/[serverId]/products/actions";

type PageProps = { params: Promise<{ serverId: string }> };

export const metadata = createAdminMetadata("Server Products");
export const dynamic = "force-dynamic";

export default async function AdminServerProductsPage({ params }: PageProps) {

  const { serverId } = await params;
  const [formData, rows] = await Promise.all([
    getAdminServerProductFormData(serverId),
    getAdminServerProductRows(serverId)
  ]);
  if (formData.available && !formData.data.server) notFound();
  const server = formData.data.server;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Server products</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {server ? `${server.titleEn} / ${server.slug}` : "Manage products attached to a server."}
          </p>
        </div>
        <AdminLink
          className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black hover:bg-orange-400"
          href={`/admin/servers/${serverId}/products/new`}
        >
          New server product
        </AdminLink>
      </div>
      {!rows.available || !formData.available ? (
        <AdminStatusNotice message="Database is unavailable. Server products cannot be loaded." />
      ) : null}
      <AdminDataTable
        columns={[
          { key: "title", header: "Title", render: (row) => row.title },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "category", header: "Category", render: (row) => row.category },
          { key: "type", header: "Type", render: (row) => row.type },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "price", header: "Price", render: (row) => `${row.priceRub} RUB` },
          { key: "templates", header: "Templates", render: (row) => row.commandTemplateCount },
          {
            key: "edit",
            header: "Edit",
            render: (row) => (
              <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/servers/${serverId}/products/${row.id}/edit`}>
                Edit
              </AdminLink>
            )
          },
          {
            key: "detach",
            header: "Detach",
            render: (row) => (
              <AdminActionButton
                action={detachProductFromServerAction.bind(null, serverId)}
                fields={{ productId: row.id }}
              >
                Detach
              </AdminActionButton>
            )
          }
        ]}
        rows={rows.data}
        emptyTitle="No server products"
        emptyDescription="Attach or create a product for this server."
      />
    </div>
  );
}
