"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { boolFromForm, requiredString, slugSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const supportSchema = z.object({
  slug: slugSchema,
  titleRu: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionRu: z.string().min(1),
  descriptionEn: z.string().min(1),
  url: z.string().url(),
  sortOrder: z.coerce.number().int(),
  isActive: z.boolean()
});

function parseSupport(formData: FormData) {
  return supportSchema.parse({
    slug: requiredString(formData.get("slug")),
    titleRu: requiredString(formData.get("titleRu")),
    titleEn: requiredString(formData.get("titleEn")),
    descriptionRu: requiredString(formData.get("descriptionRu")),
    descriptionEn: requiredString(formData.get("descriptionEn")),
    url: requiredString(formData.get("url")),
    sortOrder: requiredString(formData.get("sortOrder")) || "0",
    isActive: boolFromForm(formData, "isActive")
  });
}

export async function createSupportChannelAction(formData: FormData) {
  const user = await requireAdminWrite("support", formData);
  const data = parseSupport(formData);
  const row = await prisma.supportChannel.create({ data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "SupportChannel", entityId: row.id, message: "Created support channel.", metadata: { slug: row.slug } });
  revalidatePath("/admin/support");
  redirect("/admin/support");
}

export async function updateSupportChannelAction(channelId: string, formData: FormData) {
  const user = await requireAdminWrite("support", formData);
  const data = parseSupport(formData);
  const row = await prisma.supportChannel.update({ where: { id: channelId }, data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "SupportChannel", entityId: row.id, message: "Updated support channel.", metadata: { slug: row.slug } });
  revalidatePath("/admin/support");
  redirect("/admin/support");
}

export async function toggleSupportChannelActiveAction(formData: FormData) {
  const user = await requireAdminWrite("support", formData);
  const id = requiredString(formData.get("id"));
  const current = await prisma.supportChannel.findUniqueOrThrow({ where: { id } });
  const row = await prisma.supportChannel.update({ where: { id }, data: { isActive: !current.isActive } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "SupportChannel", entityId: id, message: "Toggled support channel active state.", metadata: { isActive: row.isActive } });
  revalidatePath("/admin/support");
}
