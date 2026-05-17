"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction } from "@prisma/client";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { couponAdminSchema } from "@/lib/admin/discount-validation";
import { boolFromForm, optionalInt, optionalString, requiredString } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

function optionalDate(value: FormDataEntryValue | null) {
  const text = optionalString(value);
  return text ? new Date(text) : null;
}

function selectedProductIds(formData: FormData) {
  return Array.from(new Set(formData.getAll("productIds").map((value) => requiredString(value)).filter(Boolean)));
}

function parseCouponForm(formData: FormData) {
  return couponAdminSchema.parse({
    code: requiredString(formData.get("code")),
    discountPercent: requiredString(formData.get("discountPercent")),
    usageLimit: optionalInt(formData.get("usageLimit")),
    expiresAt: optionalDate(formData.get("expiresAt")),
    isActive: boolFromForm(formData, "isActive"),
    appliesToAllProducts: boolFromForm(formData, "appliesToAllProducts"),
    productIds: selectedProductIds(formData)
  });
}

async function replaceCouponProducts(couponId: string, productIds: string[], appliesToAllProducts: boolean) {
  if (appliesToAllProducts) {
    await prisma.couponProduct.deleteMany({ where: { couponId } });
    return;
  }

  await prisma.couponProduct.deleteMany({
    where: { couponId, productId: { notIn: productIds } }
  });
  await Promise.all(
    productIds.map((productId) =>
      prisma.couponProduct.upsert({
        where: { couponId_productId: { couponId, productId } },
        update: {},
        create: { couponId, productId }
      })
    )
  );
}

export async function createCouponAction(formData: FormData) {
  const user = await requireAdminWrite("coupons", formData);
  const data = parseCouponForm(formData);
  const coupon = await prisma.coupon.create({
    data: {
      code: data.code,
      discountPercent: data.discountPercent,
      usageLimit: data.usageLimit,
      expiresAt: data.expiresAt,
      isActive: data.isActive,
      appliesToAllProducts: data.appliesToAllProducts
    }
  });
  await replaceCouponProducts(coupon.id, data.productIds, data.appliesToAllProducts);
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.CREATE,
    entityType: "Coupon",
    entityId: coupon.id,
    message: "Created coupon.",
    metadata: { code: coupon.code, discountPercent: coupon.discountPercent }
  });
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCouponAction(couponId: string, formData: FormData) {
  const user = await requireAdminWrite("coupons", formData);
  const data = parseCouponForm(formData);
  const coupon = await prisma.coupon.update({
    where: { id: couponId },
    data: {
      code: data.code,
      discountPercent: data.discountPercent,
      usageLimit: data.usageLimit,
      expiresAt: data.expiresAt,
      isActive: data.isActive,
      appliesToAllProducts: data.appliesToAllProducts
    }
  });
  await replaceCouponProducts(coupon.id, data.productIds, data.appliesToAllProducts);
  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "Coupon",
    entityId: coupon.id,
    message: "Updated coupon.",
    metadata: { code: coupon.code, discountPercent: coupon.discountPercent, isActive: coupon.isActive }
  });
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}
