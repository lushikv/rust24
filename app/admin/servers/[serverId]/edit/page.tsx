import { notFound } from "next/navigation";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ServerForm } from "@/app/admin/servers/ServerForm";

type PageProps = { params: Promise<{ serverId: string }> };

export const metadata = createAdminMetadata("Edit Server");

export default async function EditServerPage({ params }: PageProps) {
  const access = await getAdminAccess("servers");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const { serverId } = await params;
  const server = await prisma.server.findUnique({ where: { id: serverId } });
  if (!server) notFound();

  return (
    <AdminFormShell title="Edit server" description="Update server content and flags." backHref="/admin/servers">
      <ServerForm server={server} />
    </AdminFormShell>
  );
}
