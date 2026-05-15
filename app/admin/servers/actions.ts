"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction, TeamLimit } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { boolFromForm, optionalString, requiredString, slugSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const serverSchema = z.object({
  slug: slugSchema,
  titleRu: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionRu: z.string().nullable(),
  descriptionEn: z.string().nullable(),
  mode: z.string().min(1),
  region: z.string().min(1),
  teamLimit: z.nativeEnum(TeamLimit),
  address: z.string().min(1),
  connectCommand: z.string().min(1),
  wipeScheduleRu: z.string().min(1),
  wipeScheduleEn: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
  sortOrder: z.coerce.number().int(),
  isFeatured: z.boolean(),
  isActive: z.boolean()
});

function parseServerForm(formData: FormData) {
  return serverSchema.parse({
    slug: requiredString(formData.get("slug")),
    titleRu: requiredString(formData.get("titleRu")),
    titleEn: requiredString(formData.get("titleEn")),
    descriptionRu: optionalString(formData.get("descriptionRu")),
    descriptionEn: optionalString(formData.get("descriptionEn")),
    mode: requiredString(formData.get("mode")),
    region: requiredString(formData.get("region")),
    teamLimit: requiredString(formData.get("teamLimit")),
    address: requiredString(formData.get("address")),
    connectCommand: requiredString(formData.get("connectCommand")),
    wipeScheduleRu: requiredString(formData.get("wipeScheduleRu")),
    wipeScheduleEn: requiredString(formData.get("wipeScheduleEn")),
    capacity: requiredString(formData.get("capacity")),
    sortOrder: requiredString(formData.get("sortOrder")) || "0",
    isFeatured: boolFromForm(formData, "isFeatured"),
    isActive: boolFromForm(formData, "isActive")
  });
}

export async function createServerAction(formData: FormData) {
  const user = await requireAdminWrite("servers");
  const data = parseServerForm(formData);
  const server = await prisma.server.create({ data });
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.CREATE,
    entityType: "Server",
    entityId: server.id,
    message: "Created server.",
    metadata: { slug: server.slug }
  });
  revalidatePath("/admin/servers");
  redirect("/admin/servers");
}

export async function updateServerAction(serverId: string, formData: FormData) {
  const user = await requireAdminWrite("servers");
  const data = parseServerForm(formData);
  const server = await prisma.server.update({ where: { id: serverId }, data });
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "Server",
    entityId: server.id,
    message: "Updated server.",
    metadata: { slug: server.slug }
  });
  revalidatePath("/admin/servers");
  redirect("/admin/servers");
}

export async function toggleServerActiveAction(formData: FormData) {
  const user = await requireAdminWrite("servers");
  const id = requiredString(formData.get("id"));
  const server = await prisma.server.findUniqueOrThrow({ where: { id } });
  const updated = await prisma.server.update({
    where: { id },
    data: { isActive: !server.isActive }
  });
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "Server",
    entityId: id,
    message: "Toggled server active state.",
    metadata: { isActive: updated.isActive }
  });
  revalidatePath("/admin/servers");
}

export async function toggleServerFeaturedAction(formData: FormData) {
  const user = await requireAdminWrite("servers");
  const id = requiredString(formData.get("id"));
  const server = await prisma.server.findUniqueOrThrow({ where: { id } });
  const updated = await prisma.server.update({
    where: { id },
    data: { isFeatured: !server.isFeatured }
  });
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "Server",
    entityId: id,
    message: "Toggled server featured state.",
    metadata: { isFeatured: updated.isFeatured }
  });
  revalidatePath("/admin/servers");
}
