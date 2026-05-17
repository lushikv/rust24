import "server-only";

import { redirect } from "next/navigation";
import { UserRole, type AuditAction } from "@prisma/client";
import { ADMIN_ACTION_TOKEN_FIELD, verifyAdminActionToken } from "@/lib/admin/action-token";
import { writeAuditLog } from "@/lib/admin/audit";
import { canAccessAdminSection, type AdminSection } from "@/lib/admin/permissions";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

type AdminWriteUser = {
  id: string;
  role: UserRole;
};

async function getTokenUser(formData?: FormData): Promise<AdminWriteUser | null> {
  const payload = verifyAdminActionToken(
    typeof formData?.get(ADMIN_ACTION_TOKEN_FIELD) === "string"
      ? String(formData.get(ADMIN_ACTION_TOKEN_FIELD))
      : null
  );

  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { steamProfile: true }
  });

  if (!user?.steamProfile || user.steamProfile.steamId !== payload.steamId) {
    return null;
  }

  return {
    id: user.id,
    role: user.role
  };
}

export async function requireAdminWrite(section: AdminSection, formData?: FormData) {
  const user = (await getCurrentUser()) ?? (await getTokenUser(formData));

  if (!user) {
    redirect("/ru?auth=required");
  }

  const allowed =
    user.role === UserRole.ADMIN ||
    user.role === UserRole.OWNER ||
    (section === "bans" && canAccessAdminSection(user.role, section));

  if (!allowed) {
    throw new Error("You do not have permission to perform this admin action.");
  }

  return user;
}

export async function auditAdminWrite({
  userId,
  action,
  entityType,
  entityId,
  message,
  metadata
}: {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  message: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  await writeAuditLog({
    userId,
    action,
    entityType,
    entityId,
    message,
    metadata
  });
}
