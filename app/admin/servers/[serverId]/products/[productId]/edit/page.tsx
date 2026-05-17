import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminServerProductFormData } from "@/lib/admin/repositories/server-products";
import { ServerProductForm } from "@/app/admin/servers/[serverId]/products/ServerProductForm";

type PageProps = { params: Promise<{ serverId: string; productId: string }> };

export const metadata = createAdminMetadata("Edit Server Product");
export const dynamic = "force-dynamic";

export default async function EditServerProductPage({ params }: PageProps) {

  const { serverId, productId } = await params;
  const result = await getAdminServerProductFormData(serverId, productId);
  if (result.available && (!result.data.server || !result.data.product)) notFound();

  return (
    <AdminFormShell title="Edit server product" description="Update product availability and delivery command templates." backHref={`/admin/servers/${serverId}/products`}>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Product form data cannot be loaded." /> : null}
      <ServerProductForm
        serverId={serverId}
        product={result.data.product}
        categories={result.data.categories}
        servers={result.data.servers}
      />
    </AdminFormShell>
  );
}
