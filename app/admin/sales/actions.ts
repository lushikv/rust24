"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction } from "@prisma/client";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { saleAdminSchema } from "@/lib/admin/discount-validation";
import { boolFromForm, optionalString, requiredString } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

function requiredDate(value: FormDataEntryValue | null) {
  const text = optionalString(value);
  return text ? new Date(text) : new Date(Number.NaN);
}

function selectedProductIds(formData: FormData) {
  return Array.from(new Set(formData.getAll("productIds").map((value) => requiredString(value)).filter(Boolean)));
}

function parseSaleForm(formData: FormData) {
  return saleAdminSchema.parse({
    title: requiredString(formData.get("title")),
    discountPercent: requiredString(formData.get("discountPercent")),
    startsAt: requiredDate(formData.get("startsAt")),
    endsAt: requiredDate(formData.get("endsAt")),
    isActive: boolFromForm(formData, "isActive"),
    appliesToAllProducts: boolFromForm(formData, "appliesToAllProducts"),
    productIds: selectedProductIds(formData)
  });
}

async function replaceSaleProducts(saleCampaignId: string, productIds: string[], appliesToAllProducts: boolean) {
  if (appliesToAllProducts) {
    await prisma.saleCampaignProduct.deleteMany({ where: { saleCampaignId } });
    return;
  }

  await prisma.saleCampaignProduct.deleteMany({
    where: { saleCampaignId, productId: { notIn: productIds } }
  });
  await Promise.all(
    productIds.map((productId) =>
      prisma.saleCampaignProduct.upsert({
        where: { saleCampaignId_productId: { saleCampaignId, productId } },
        update: {},
        create: { saleCampaignId, productId }
      })
    )
  );
}

export async function createSaleAction(formData: FormData) {
  const user = await requireAdminWrite("sales", formData);
  const data = parseSaleForm(formData);
  const sale = await prisma.saleCampaign.create({
    data: {
      title: data.title,
      discountPercent: data.discountPercent,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      isActive: data.isActive,
      appliesToAllProducts: data.appliesToAllProducts
    }
  });
  await replaceSaleProducts(sale.id, data.productIds, data.appliesToAllProducts);
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.CREATE,
    entityType: "SaleCampaign",
    entityId: sale.id,
    message: "Created sale campaign.",
    metadata: { title: sale.title, discountPercent: sale.discountPercent }
  });
  revalidatePath("/admin/sales");
  redirect("/admin/sales");
}

export async function updateSaleAction(saleId: string, formData: FormData) {
  const user = await requireAdminWrite("sales", formData);
  const data = parseSaleForm(formData);
  const sale = await prisma.saleCampaign.update({
    where: { id: saleId },
    data: {
      title: data.title,
      discountPercent: data.discountPercent,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      isActive: data.isActive,
      appliesToAllProducts: data.appliesToAllProducts
    }
  });
  await replaceSaleProducts(sale.id, data.productIds, data.appliesToAllProducts);
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "SaleCampaign",
    entityId: sale.id,
    message: "Updated sale campaign.",
    metadata: { title: sale.title, discountPercent: sale.discountPercent, isActive: sale.isActive }
  });
  revalidatePath("/admin/sales");
  redirect("/admin/sales");
}
