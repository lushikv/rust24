import "server-only";

import { Locale } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminProductRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  status: string;
  priceRub: number;
  priceEur: number | null;
  isFeatured: boolean;
};

export async function getAdminProducts() {
  return adminQuery(
    "products",
    async () => {
      const rows = await prisma.product.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
          category: true,
          translations: { where: { locale: Locale.EN }, take: 1 }
        }
      });

      return rows.map((product) => ({
        id: product.id,
        title: product.translations[0]?.title ?? product.slug,
        slug: product.slug,
        category: product.category.titleEn,
        type: product.type,
        status: product.status,
        priceRub: product.priceRub,
        priceEur: product.priceEur,
        isFeatured: product.isFeatured
      }));
    },
    [] as AdminProductRow[]
  );
}
