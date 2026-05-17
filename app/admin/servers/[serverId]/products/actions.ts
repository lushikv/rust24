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
import { assertValidCommandTemplate } from "@/lib/delivery/command-template-validation";
import { prisma } from "@/lib/prisma";

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
  enModeRestrictions: z.string().array(),
  serverIds: z.string().array()
});

const commandTemplateSchema = z.object({
  commandTemplate: z.string().min(1),
  description: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int()
});

function parseProductForm(formData: FormData, serverId: string) {
  const selectedServers = formData
    .getAll("serverIds")
    .map((value) => requiredString(value))
    .filter(Boolean);
  const serverIds = Array.from(new Set([serverId, ...selectedServers]));

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
    enModeRestrictions: linesFromForm(formData.get("enModeRestrictions")),
    serverIds
  });
}

function parseCommandTemplateForm(formData: FormData) {
  const data = commandTemplateSchema.parse({
    commandTemplate: requiredString(formData.get("commandTemplate")),
    description: optionalString(formData.get("description")),
    isActive: boolFromForm(formData, "isActive"),
    sortOrder: requiredString(formData.get("sortOrder")) || "0"
  });

  assertValidCommandTemplate(data.commandTemplate);
  return data;
}

async function upsertTranslations(productId: string, data: z.infer<typeof productSchema>) {
  await Promise.all([
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId, locale: Locale.RU } },
      update: {
        title: data.ruTitle,
        description: data.ruDescription,
        shortDescription: data.ruShortDescription,
        includedItems: data.ruIncludedItems,
        modeRestrictions: data.ruModeRestrictions
      },
      create: {
        productId,
        locale: Locale.RU,
        title: data.ruTitle,
        description: data.ruDescription,
        shortDescription: data.ruShortDescription,
        includedItems: data.ruIncludedItems,
        modeRestrictions: data.ruModeRestrictions
      }
    }),
    prisma.productTranslation.upsert({
      where: { productId_locale: { productId, locale: Locale.EN } },
      update: {
        title: data.enTitle,
        description: data.enDescription,
        shortDescription: data.enShortDescription,
        includedItems: data.enIncludedItems,
        modeRestrictions: data.enModeRestrictions
      },
      create: {
        productId,
        locale: Locale.EN,
        title: data.enTitle,
        description: data.enDescription,
        shortDescription: data.enShortDescription,
        includedItems: data.enIncludedItems,
        modeRestrictions: data.enModeRestrictions
      }
    })
  ]);
}

async function replaceProductServers(productId: string, serverIds: string[]) {
  await prisma.productServer.deleteMany({
    where: {
      productId,
      serverId: { notIn: serverIds }
    }
  });
  await Promise.all(
    serverIds.map((serverId) =>
      prisma.productServer.upsert({
        where: { productId_serverId: { productId, serverId } },
        update: {},
        create: { productId, serverId }
      })
    )
  );
}

export async function createServerProductAction(serverId: string, formData: FormData) {
  const user = await requireAdminWrite("products", formData);
  const data = parseProductForm(formData, serverId);
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
  await replaceProductServers(product.id, data.serverIds);
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.CREATE,
    entityType: "Product",
    entityId: product.id,
    message: "Created server product.",
    metadata: { slug: product.slug, serverId }
  });
  revalidatePath(`/admin/servers/${serverId}/products`);
  redirect(`/admin/servers/${serverId}/products/${product.id}/edit`);
}

export async function updateServerProductAction(serverId: string, productId: string, formData: FormData) {
  const user = await requireAdminWrite("products", formData);
  const data = parseProductForm(formData, serverId);
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
  await replaceProductServers(product.id, data.serverIds);
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "Product",
    entityId: product.id,
    message: "Updated server product.",
    metadata: { slug: product.slug, serverId }
  });
  revalidatePath(`/admin/servers/${serverId}/products`);
  redirect(`/admin/servers/${serverId}/products`);
}

export async function detachProductFromServerAction(serverId: string, formData: FormData) {
  const user = await requireAdminWrite("products", formData);
  const productId = requiredString(formData.get("productId"));
  await prisma.productServer.deleteMany({ where: { productId, serverId } });
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "ProductServer",
    entityId: productId,
    message: "Detached product from server.",
    metadata: { productId, serverId }
  });
  revalidatePath(`/admin/servers/${serverId}/products`);
}

export async function createCommandTemplateAction(serverId: string, productId: string, formData: FormData) {
  const user = await requireAdminWrite("products", formData);
  const data = parseCommandTemplateForm(formData);
  const template = await prisma.productCommandTemplate.create({
    data: {
      productId,
      serverId,
      commandTemplate: data.commandTemplate,
      description: data.description,
      isActive: data.isActive,
      sortOrder: data.sortOrder
    }
  });
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.CREATE,
    entityType: "ProductCommandTemplate",
    entityId: template.id,
    message: "Created command template.",
    metadata: { productId, serverId }
  });
  revalidatePath(`/admin/servers/${serverId}/products/${productId}/edit`);
}

export async function updateCommandTemplateAction(serverId: string, productId: string, templateId: string, formData: FormData) {
  const user = await requireAdminWrite("products", formData);
  const data = parseCommandTemplateForm(formData);
  await prisma.productCommandTemplate.update({
    where: { id: templateId },
    data
  });
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "ProductCommandTemplate",
    entityId: templateId,
    message: "Updated command template.",
    metadata: { productId, serverId, isActive: data.isActive }
  });
  revalidatePath(`/admin/servers/${serverId}/products/${productId}/edit`);
}

export async function toggleCommandTemplateActiveAction(serverId: string, productId: string, formData: FormData) {
  const user = await requireAdminWrite("products", formData);
  const templateId = requiredString(formData.get("templateId"));
  const current = await prisma.productCommandTemplate.findUniqueOrThrow({ where: { id: templateId } });
  const updated = await prisma.productCommandTemplate.update({
    where: { id: templateId },
    data: { isActive: !current.isActive }
  });
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "ProductCommandTemplate",
    entityId: templateId,
    message: "Toggled command template active state.",
    metadata: { productId, serverId, isActive: updated.isActive }
  });
  revalidatePath(`/admin/servers/${serverId}/products/${productId}/edit`);
}
