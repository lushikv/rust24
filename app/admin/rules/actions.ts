"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { boolFromForm, optionalString, requiredString, slugSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const sectionSchema = z.object({
  slug: slugSchema,
  titleRu: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionRu: z.string().nullable(),
  descriptionEn: z.string().nullable(),
  sortOrder: z.coerce.number().int(),
  isPublished: z.boolean()
});

const itemSchema = z.object({
  sectionId: z.string().min(1),
  code: z.string().nullable(),
  textRu: z.string().min(1),
  textEn: z.string().min(1),
  severity: z.string().nullable(),
  sortOrder: z.coerce.number().int()
});

function parseSection(formData: FormData) {
  return sectionSchema.parse({
    slug: requiredString(formData.get("slug")),
    titleRu: requiredString(formData.get("titleRu")),
    titleEn: requiredString(formData.get("titleEn")),
    descriptionRu: optionalString(formData.get("descriptionRu")),
    descriptionEn: optionalString(formData.get("descriptionEn")),
    sortOrder: requiredString(formData.get("sortOrder")) || "0",
    isPublished: boolFromForm(formData, "isPublished")
  });
}

function parseItem(formData: FormData) {
  return itemSchema.parse({
    sectionId: requiredString(formData.get("sectionId")),
    code: optionalString(formData.get("code")),
    textRu: requiredString(formData.get("textRu")),
    textEn: requiredString(formData.get("textEn")),
    severity: optionalString(formData.get("severity")),
    sortOrder: requiredString(formData.get("sortOrder")) || "0"
  });
}

export async function createRuleSectionAction(formData: FormData) {
  const user = await requireAdminWrite("rules", formData);
  const data = parseSection(formData);
  const row = await prisma.ruleSection.create({ data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "RuleSection", entityId: row.id, message: "Created rule section.", metadata: { slug: row.slug } });
  revalidatePath("/admin/rules");
  redirect("/admin/rules");
}

export async function updateRuleSectionAction(sectionId: string, formData: FormData) {
  const user = await requireAdminWrite("rules", formData);
  const data = parseSection(formData);
  const row = await prisma.ruleSection.update({ where: { id: sectionId }, data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "RuleSection", entityId: row.id, message: "Updated rule section.", metadata: { slug: row.slug } });
  revalidatePath("/admin/rules");
  redirect("/admin/rules");
}

export async function toggleRuleSectionPublishedAction(formData: FormData) {
  const user = await requireAdminWrite("rules", formData);
  const id = requiredString(formData.get("id"));
  const current = await prisma.ruleSection.findUniqueOrThrow({ where: { id } });
  const row = await prisma.ruleSection.update({ where: { id }, data: { isPublished: !current.isPublished } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "RuleSection", entityId: id, message: "Toggled rule section published state.", metadata: { isPublished: row.isPublished } });
  revalidatePath("/admin/rules");
}

export async function createRuleItemAction(formData: FormData) {
  const user = await requireAdminWrite("rules", formData);
  const data = parseItem(formData);
  const row = await prisma.ruleItem.create({ data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "RuleItem", entityId: row.id, message: "Created rule item." });
  revalidatePath("/admin/rules");
  redirect("/admin/rules");
}

export async function updateRuleItemAction(itemId: string, formData: FormData) {
  const user = await requireAdminWrite("rules", formData);
  const data = parseItem(formData);
  const row = await prisma.ruleItem.update({ where: { id: itemId }, data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "RuleItem", entityId: row.id, message: "Updated rule item." });
  revalidatePath("/admin/rules");
  redirect("/admin/rules");
}
