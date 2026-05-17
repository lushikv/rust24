import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminServerProductFormData } from "@/lib/admin/repositories/server-products";
import { ServerProductForm } from "@/app/admin/servers/[serverId]/products/ServerProductForm";

type PageProps = { params: Promise<{ serverId: string }> };

export const metadata = createAdminMetadata("New Server Product");
export const dynamic = "force-dynamic";

export default async function NewServerProductPage({ params }: PageProps) {

  const { serverId } = await params;
  const result = await getAdminServerProductFormData(serverId);
  if (result.available && !result.data.server) notFound();

  return (
    <AdminFormShell title="New server product" description="Create a product and attach it to this server." backHref={`/admin/servers/${serverId}/products`}>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Product form data cannot be loaded." /> : null}
      <ServerProductForm
        serverId={serverId}
        categories={result.data.categories}
        servers={result.data.servers}
      />
    </AdminFormShell>
  );
}
