"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { boolFromForm, requiredString, slugSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  slug: slugSchema,
  titleRu: z.string().min(1),
  titleEn: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  isActive: z.boolean()
});

const articleSchema = z.object({
  categoryId: z.string().min(1),
  slug: slugSchema,
  questionRu: z.string().min(1),
  questionEn: z.string().min(1),
  answerRu: z.string().min(1),
  answerEn: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  isPublished: z.boolean()
});

function parseCategory(formData: FormData) {
  return categorySchema.parse({
    slug: requiredString(formData.get("slug")),
    titleRu: requiredString(formData.get("titleRu")),
    titleEn: requiredString(formData.get("titleEn")),
    sortOrder: requiredString(formData.get("sortOrder")) || "0",
    isActive: boolFromForm(formData, "isActive")
  });
}

function parseArticle(formData: FormData) {
  return articleSchema.parse({
    categoryId: requiredString(formData.get("categoryId")),
    slug: requiredString(formData.get("slug")),
    questionRu: requiredString(formData.get("questionRu")),
    questionEn: requiredString(formData.get("questionEn")),
    answerRu: requiredString(formData.get("answerRu")),
    answerEn: requiredString(formData.get("answerEn")),
    sortOrder: requiredString(formData.get("sortOrder")) || "0",
    isPublished: boolFromForm(formData, "isPublished")
  });
}

export async function createFAQCategoryAction(formData: FormData) {
  const user = await requireAdminWrite("faq");
  const data = parseCategory(formData);
  const row = await prisma.fAQCategory.create({ data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "FAQCategory", entityId: row.id, message: "Created FAQ category.", metadata: { slug: row.slug } });
  revalidatePath("/admin/faq");
  redirect("/admin/faq/categories");
}

export async function updateFAQCategoryAction(categoryId: string, formData: FormData) {
  const user = await requireAdminWrite("faq");
  const data = parseCategory(formData);
  const row = await prisma.fAQCategory.update({ where: { id: categoryId }, data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "FAQCategory", entityId: row.id, message: "Updated FAQ category.", metadata: { slug: row.slug } });
  revalidatePath("/admin/faq");
  redirect("/admin/faq/categories");
}

export async function toggleFAQCategoryActiveAction(formData: FormData) {
  const user = await requireAdminWrite("faq");
  const id = requiredString(formData.get("id"));
  const current = await prisma.fAQCategory.findUniqueOrThrow({ where: { id } });
  const row = await prisma.fAQCategory.update({ where: { id }, data: { isActive: !current.isActive } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "FAQCategory", entityId: id, message: "Toggled FAQ category active state.", metadata: { isActive: row.isActive } });
  revalidatePath("/admin/faq");
}

export async function createFAQArticleAction(formData: FormData) {
  const user = await requireAdminWrite("faq");
  const data = parseArticle(formData);
  const row = await prisma.fAQArticle.create({ data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "FAQArticle", entityId: row.id, message: "Created FAQ article.", metadata: { slug: row.slug } });
  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function updateFAQArticleAction(articleId: string, formData: FormData) {
  const user = await requireAdminWrite("faq");
  const data = parseArticle(formData);
  const row = await prisma.fAQArticle.update({ where: { id: articleId }, data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "FAQArticle", entityId: row.id, message: "Updated FAQ article.", metadata: { slug: row.slug } });
  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function toggleFAQArticlePublishedAction(formData: FormData) {
  const user = await requireAdminWrite("faq");
  const id = requiredString(formData.get("id"));
  const current = await prisma.fAQArticle.findUniqueOrThrow({ where: { id } });
  const row = await prisma.fAQArticle.update({ where: { id }, data: { isPublished: !current.isPublished } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "FAQArticle", entityId: id, message: "Toggled FAQ article published state.", metadata: { isPublished: row.isPublished } });
  revalidatePath("/admin/faq");
}
