import "server-only";

import { redirect } from "next/navigation";
import { UserRole, type AuditAction } from "@prisma/client";
import { writeAuditLog } from "@/lib/admin/audit";
import { canAccessAdminSection, type AdminSection } from "@/lib/admin/permissions";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function requireAdminWrite(section: AdminSection) {
  const user = await getCurrentUser();

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
