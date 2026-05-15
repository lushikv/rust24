"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction, Locale, ProductStatus, ProductType } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import {
  boolFromForm,
  linesFromForm,
  optionalInt,
  optionalString,
  requiredString,
  slugSchema
} from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  slug: slugSchema,
  titleRu: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionRu: z.string().nullable(),
  descriptionEn: z.string().nullable(),
  sortOrder: z.coerce.number().int(),
  isActive: z.boolean()
});

const productSchema = z.object({
  categoryId: z.string().min(1),
  slug: slugSchema,
  type: z.nativeEnum(ProductType),
  status: z.nativeEnum(ProductStatus),
  priceRub: z.coerce.number().int().min(0),
  priceEur: z.number().int().min(0).nullable(),
  oldPriceRub: z.number().int().min(0).nullable(),
  oldPriceEur: z.number().int().min(0).nullable(),
  durationDays: z.number().int().positive().nullable(),
  imageUrl: z.string().url().nullable(),
  sortOrder: z.coerce.number().int(),
  isFeatured: z.boolean(),
  ruTitle: z.string().min(1),
  ruDescription: z.string().min(1),
  ruShortDescription: z.string().nullable(),
  ruIncludedItems: z.string().array(),
  ruModeRestrictions: z.string().array(),
  enTitle: z.string().min(1),
  enDescription: z.string().min(1),
  enShortDescription: z.string().nullable(),
  enIncludedItems: z.string().array(),
  enModeRestrictions: z.string().array()
});

function parseCategoryForm(formData: FormData) {
  return categorySchema.parse({
    slug: requiredString(formData.get("slug")),
    titleRu: requiredString(formData.get("titleRu")),
    titleEn: requiredString(formData.get("titleEn")),
    descriptionRu: optionalString(formData.get("descriptionRu")),
    descriptionEn: optionalString(formData.get("descriptionEn")),
    sortOrder: requiredString(formData.get("sortOrder")) || "0",
    isActive: boolFromForm(formData, "isActive")
  });
}

function parseProductForm(formData: FormData) {
  return productSchema.parse({
    categoryId: requiredString(formData.get("categoryId")),
    slug: requiredString(formData.get("slug")),
    type: requiredString(formData.get("type")),
    status: requiredString(formData.get("status")),
    priceRub: requiredString(formData.get("priceRub")) || "0",
    priceEur: optionalInt(formData.get("priceEur")),
    oldPriceRub: optionalInt(formData.get("oldPriceRub")),
    oldPriceEur: optionalInt(formData.get("oldPriceEur")),
    durationDays: optionalInt(formData.get("durationDays")),
    imageUrl: optionalString(formData.get("imageUrl")),
    sortOrder: requiredString(formData.get("sortOrder")) || "0",
    isFeatured: boolFromForm(formData, "isFeatured"),
    ruTitle: requiredString(formData.get("ruTitle")),
    ruDescription: requiredString(formData.get("ruDescription")),
    ruShortDescription: optionalString(formData.get("ruShortDescription")),
    ruIncludedItems: linesFromForm(formData.get("ruIncludedItems")),
    ruModeRestrictions: linesFromForm(formData.get("ruModeRestrictions")),
    enTitle: requiredString(formData.get("enTitle")),
    enDescription: requiredString(formData.get("enDescription")),
    enShortDescription: optionalString(formData.get("enShortDescription")),
    enIncludedItems: linesFromForm(formData.get("enIncludedItems")),
    enModeRestrictions: linesFromForm(formData.get("enModeRestrictions"))
  });
}

export async function createProductCategoryAction(formData: FormData) {
  const user = await requireAdminWrite("products");
  const data = parseCategoryForm(formData);
  const category = await prisma.productCategory.create({ data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "ProductCategory", entityId: category.id, message: "Created product category.", metadata: { slug: category.slug } });
  revalidatePath("/admin/products/categories");
  redirect("/admin/products/categories");
}

export async function updateProductCategoryAction(categoryId: string, formData: FormData) {
  const user = await requireAdminWrite("products");
  const data = parseCategoryForm(formData);
  const category = await prisma.productCategory.update({ where: { id: categoryId }, data });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "ProductCategory", entityId: category.id, message: "Updated product category.", metadata: { slug: category.slug } });
  revalidatePath("/admin/products/categories");
  redirect("/admin/products/categories");
}

export async function toggleProductCategoryActiveAction(formData: FormData) {
  const user = await requireAdminWrite("products");
  const id = requiredString(formData.get("id"));
  const current = await prisma.productCategory.findUniqueOrThrow({ where: { id } });
  const updated = await prisma.productCategory.update({ where: { id }, data: { isActive: !current.isActive } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "ProductCategory", entityId: id, message: "Toggled category active state.", metadata: { isActive: updated.isActive } });
  revalidatePath("/admin/products/categories");
}

async function upsertTranslations(productId: string, data: z.infer<typeof productSchema>) {
  await Promise.all([
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId, locale: Locale.RU } },
      update: { title: data.ruTitle, description: data.ruDescription, shortDescription: data.ruShortDescription, includedItems: data.ruIncludedItems, modeRestrictions: data.ruModeRestrictions },
      create: { productId, locale: Locale.RU, title: data.ruTitle, description: data.ruDescription, shortDescription: data.ruShortDescription, includedItems: data.ruIncludedItems, modeRestrictions: data.ruModeRestrictions }
    }),
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId, locale: Locale.EN } },
      update: { title: data.enTitle, description: data.enDescription, shortDescription: data.enShortDescription, includedItems: data.enIncludedItems, modeRestrictions: data.enModeRestrictions },
      create: { productId, locale: Locale.EN, title: data.enTitle, description: data.enDescription, shortDescription: data.enShortDescription, includedItems: data.enIncludedItems, modeRestrictions: data.enModeRestrictions }
    })
  ]);
}

export async function createProductAction(formData: FormData) {
  const user = await requireAdminWrite("products");
  const data = parseProductForm(formData);
  const product = await prisma.product.create({
    data: {
      categoryId: data.categoryId,
      slug: data.slug,
      type: data.type,
      status: data.status,
      priceRub: data.priceRub,
      priceEur: data.priceEur,
      oldPriceRub: data.oldPriceRub,
      oldPriceEur: data.oldPriceEur,
      durationDays: data.durationDays,
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder,
      isFeatured: data.isFeatured
    }
  });
  await upsertTranslations(product.id, data);
  await auditAdminWrite({ userId: user.id, action: AuditAction.CREATE, entityType: "Product", entityId: product.id, message: "Created product.", metadata: { slug: product.slug } });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  const user = await requireAdminWrite("products");
  const data = parseProductForm(formData);
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      categoryId: data.categoryId,
      slug: data.slug,
      type: data.type,
      status: data.status,
      priceRub: data.priceRub,
      priceEur: data.priceEur,
      oldPriceRub: data.oldPriceRub,
      oldPriceEur: data.oldPriceEur,
      durationDays: data.durationDays,
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder,
      isFeatured: data.isFeatured
    }
  });
  await upsertTranslations(product.id, data);
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "Product", entityId: product.id, message: "Updated product.", metadata: { slug: product.slug } });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function archiveProductAction(formData: FormData) {
  const user = await requireAdminWrite("products");
  const id = requiredString(formData.get("id"));
  await prisma.product.update({ where: { id }, data: { status: ProductStatus.ARCHIVED } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "Product", entityId: id, message: "Archived product." });
  revalidatePath("/admin/products");
}

export async function toggleProductFeaturedAction(formData: FormData) {
  const user = await requireAdminWrite("products");
  const id = requiredString(formData.get("id"));
  const current = await prisma.product.findUniqueOrThrow({ where: { id } });
  const updated = await prisma.product.update({ where: { id }, data: { isFeatured: !current.isFeatured } });
  await auditAdminWrite({ userId: user.id, action: AuditAction.UPDATE, entityType: "Product", entityId: id, message: "Toggled product featured state.", metadata: { isFeatured: updated.isFeatured } });
  revalidatePath("/admin/products");
}
