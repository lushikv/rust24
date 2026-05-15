import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminAuditLogRow = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  user: string;
  message: string | null;
  createdAt: string;
};

export async function getAdminAuditLogs() {
  return adminQuery(
    "audit-log",
    async () => {
      const rows = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { user: { include: { steamProfile: true } } }
      });

      return rows.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        user: log.user?.displayName ?? log.user?.steamProfile?.personaName ?? "System",
        message: log.message,
        createdAt: log.createdAt.toISOString()
      }));
    },
    [] as AdminAuditLogRow[]
  );
}
