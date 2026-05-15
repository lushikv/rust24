import "server-only";

import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function writeAuditLog({
  userId,
  action,
  entityType,
  entityId,
  message,
  metadata
}: {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  message?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        message,
        metadata
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const messageText = error instanceof Error ? error.message : String(error);
      console.warn(`[admin-audit] ${messageText}`);
    }
  }
}
