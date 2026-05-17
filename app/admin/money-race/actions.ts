"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { boolFromForm, dateFromForm, requiredString, slugSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const seasonSchema = z
  .object({
    slug: slugSchema,
    titleRu: z.string().min(1),
    titleEn: z.string().min(1),
    prizePoolRub: z.coerce.number().int().min(0),
    startsAt: z.date(),
    endsAt: z.date(),
    isActive: z.boolean()
  })
  .refine((data) => data.startsAt < data.endsAt, "startsAt must be before endsAt");

function parseSeason(formData: FormData) {
  return seasonSchema.parse({
    slug: requiredString(formData.get("slug")),
    titleRu: requiredString(formData.get("titleRu")),
    titleEn: requiredString(formData.get("titleEn")),
    prizePoolRub: requiredString(formData.get("prizePoolRub")) || "0",
    startsAt: dateFromForm(formData.get("startsAt")) ?? new Date(""),
    endsAt: dateFromForm(formData.get("endsAt")) ?? new Date(""),
    isActive: boolFromForm(formData, "isActive")
  });
}

async function deactivateOtherSeasons(active: boolean, currentId?: string) {
  if (!active) return;
  await prisma.moneyRaceSeason.updateMany({
    where: currentId ? { id: { not: currentId } } : {},
    data: { isActive: false }
  });
}

export async function createMoneyRaceSeasonAction(formData: FormData) {
  const user = await requireAdminWrite("moneyRace", formData);
  const data = parseSeason(formData);
  await deactivateOtherSeasons(data.isActive);
  const row = await prisma.moneyRaceSeason.create({ data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "MoneyRaceSeason", entityId: row.id, message: "Created Money Race season.", metadata: { slug: row.slug, isActive: row.isActive } });
  revalidatePath("/admin/money-race");
  redirect("/admin/money-race");
}

export async function updateMoneyRaceSeasonAction(seasonId: string, formData: FormData) {
  const user = await requireAdminWrite("moneyRace", formData);
  const data = parseSeason(formData);
  await deactivateOtherSeasons(data.isActive, seasonId);
  const row = await prisma.moneyRaceSeason.update({ where: { id: seasonId }, data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "MoneyRaceSeason", entityId: row.id, message: "Updated Money Race season.", metadata: { slug: row.slug, isActive: row.isActive } });
  revalidatePath("/admin/money-race");
  redirect("/admin/money-race");
}

export async function toggleMoneyRaceSeasonActiveAction(formData: FormData) {
  const user = await requireAdminWrite("moneyRace", formData);
  const id = requiredString(formData.get("id"));
  const current = await prisma.moneyRaceSeason.findUniqueOrThrow({ where: { id } });
  const next = !current.isActive;
  await deactivateOtherSeasons(next, id);
  const row = await prisma.moneyRaceSeason.update({ where: { id }, data: { isActive: next } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "MoneyRaceSeason", entityId: id, message: "Toggled Money Race season active state.", metadata: { isActive: row.isActive } });
  revalidatePath("/admin/money-race");
}
