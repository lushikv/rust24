import { notFound } from "next/navigation";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { SupportForm } from "@/app/admin/support/SupportForm";

type PageProps = { params: Promise<{ channelId: string }> };
export const metadata = createAdminMetadata("Edit Support Channel");
export default async function EditSupportPage({ params }: PageProps) {
  const access = await getAdminAccess("support");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const { channelId } = await params;
  const channel = await prisma.supportChannel.findUnique({ where: { id: channelId } });
  if (!channel) notFound();
  return <AdminFormShell title="Edit support channel" description="Update support channel." backHref="/admin/support"><SupportForm channel={channel} /></AdminFormShell>;
}
