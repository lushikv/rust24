import { notFound } from "next/navigation";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { BanForm } from "@/app/admin/bans/BanForm";

type PageProps = { params: Promise<{ banId: string }> };
export const metadata = createAdminMetadata("Edit Ban");
export default async function EditBanPage({ params }: PageProps) {
  const access = await getAdminAccess("bans");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const { banId } = await params;
  const ban = await prisma.banRecord.findUnique({ where: { id: banId } });
  if (!ban) notFound();
  return <AdminFormShell title="Edit ban" description="Update ban record." backHref="/admin/bans"><BanForm ban={ban} /></AdminFormShell>;
}
