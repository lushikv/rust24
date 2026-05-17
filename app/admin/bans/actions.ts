"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction, BanStatus } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { dateFromForm, optionalString, requiredString } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const banSchema = z.object({
  playerName: z.string().min(1),
  playerPublicId: z.string().nullable(),
  reasonRu: z.string().min(1),
  reasonEn: z.string().min(1),
  serverName: z.string().min(1),
  status: z.nativeEnum(BanStatus),
  bannedAt: z.date(),
  expiresAt: z.date().nullable()
});

function parseBan(formData: FormData) {
  const bannedAt = dateFromForm(formData.get("bannedAt"));
  return banSchema.parse({
    playerName: requiredString(formData.get("playerName")),
    playerPublicId: optionalString(formData.get("playerPublicId")),
    reasonRu: requiredString(formData.get("reasonRu")),
    reasonEn: requiredString(formData.get("reasonEn")),
    serverName: requiredString(formData.get("serverName")),
    status: requiredString(formData.get("status")),
    bannedAt: bannedAt ?? new Date(""),
    expiresAt: dateFromForm(formData.get("expiresAt"))
  });
}

export async function createBanAction(formData: FormData) {
  const user = await requireAdminWrite("bans", formData);
  const data = parseBan(formData);
  const row = await prisma.banRecord.create({ data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "BanRecord", entityId: row.id, message: "Created ban record.", metadata: { playerName: row.playerName } });
  revalidatePath("/admin/bans");
  redirect("/admin/bans");
}

export async function updateBanAction(banId: string, formData: FormData) {
  const user = await requireAdminWrite("bans", formData);
  const data = parseBan(formData);
  const row = await prisma.banRecord.update({ where: { id: banId }, data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "BanRecord", entityId: row.id, message: "Updated ban record.", metadata: { status: row.status } });
  revalidatePath("/admin/bans");
  redirect("/admin/bans");
}

export async function changeBanStatusAction(formData: FormData) {
  const user = await requireAdminWrite("bans", formData);
  const id = requiredString(formData.get("id"));
  const status = z.nativeEnum(BanStatus).parse(requiredString(formData.get("status")));
  const row = await prisma.banRecord.update({ where: { id }, data: { status } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "BanRecord", entityId: id, message: "Changed ban status.", metadata: { status: row.status } });
  revalidatePath("/admin/bans");
}
