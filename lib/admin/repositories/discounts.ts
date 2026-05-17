import "server-only";

import { Locale } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminDiscountProductOption = {
  id: string;
  title: string;
  slug: string;
};

export type AdminCouponRow = {
  id: string;
  code: string;
  discountPercent: number;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  appliesToAllProducts: boolean;
  productCount: number;
};

export type AdminSaleRow = {
  id: string;
  title: string;
  discountPercent: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  appliesToAllProducts: boolean;
  productCount: number;
};

async function productOptions() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      translations: { where: { locale: Locale.EN }, take: 1 }
    }
  });

  return products.map((product) => ({
    id: product.id,
    title: product.translations[0]?.title ?? product.slug,
    slug: product.slug
  }));
}

export async function getAdminCoupons() {
  return adminQuery(
    "coupons",
    async () => {
      const rows = await prisma.coupon.findMany({
        orderBy: [{ createdAt: "desc" }],
        include: { products: true }
      });

      return rows.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        expiresAt: coupon.expiresAt?.toISOString() ?? null,
        isActive: coupon.isActive,
        appliesToAllProducts: coupon.appliesToAllProducts,
        productCount: coupon.products.length
      }));
    },
    [] as AdminCouponRow[]
  );
}

export async function getAdminCouponFormData(couponId?: string) {
  return adminQuery(
    "coupon-form",
    async () => {
      const [products, coupon] = await Promise.all([
        productOptions(),
        couponId
          ? prisma.coupon.findUnique({
              where: { id: couponId },
              include: { products: true }
            })
          : null
      ]);

      return { products, coupon };
    },
    { products: [] as AdminDiscountProductOption[], coupon: null }
  );
}

export async function getAdminSales() {
  return adminQuery(
    "sales",
    async () => {
      const rows = await prisma.saleCampaign.findMany({
        orderBy: [{ startsAt: "desc" }],
        include: { products: true }
      });

      return rows.map((sale) => ({
        id: sale.id,
        title: sale.title,
        discountPercent: sale.discountPercent,
        startsAt: sale.startsAt.toISOString(),
        endsAt: sale.endsAt.toISOString(),
        isActive: sale.isActive,
        appliesToAllProducts: sale.appliesToAllProducts,
        productCount: sale.products.length
      }));
    },
    [] as AdminSaleRow[]
  );
}

export async function getAdminSaleFormData(saleId?: string) {
  return adminQuery(
    "sale-form",
    async () => {
      const [products, sale] = await Promise.all([
        productOptions(),
        saleId
          ? prisma.saleCampaign.findUnique({
              where: { id: saleId },
              include: { products: true }
            })
          : null
      ]);

      return { products, sale };
    },
    { products: [] as AdminDiscountProductOption[], sale: null }
  );
}
