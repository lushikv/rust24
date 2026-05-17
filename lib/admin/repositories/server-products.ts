import "server-only";

import { Locale } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminServerProductRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  type: string;
  priceRub: number;
  isFeatured: boolean;
  commandTemplateCount: number;
};

export async function getAdminServerProductRows(serverId: string) {
  return adminQuery(
    "server-products",
    async () => {
      const rows = await prisma.productServer.findMany({
        where: { serverId },
        orderBy: { product: { sortOrder: "asc" } },
        include: {
          product: {
            include: {
              category: true,
              translations: { where: { locale: Locale.EN }, take: 1 },
              commandTemplates: { where: { serverId } }
            }
          }
        }
      });

      return rows.map(({ product }) => ({
        id: product.id,
        title: product.translations[0]?.title ?? product.slug,
        slug: product.slug,
        category: product.category.titleEn,
        status: product.status,
        type: product.type,
        priceRub: product.priceRub,
        isFeatured: product.isFeatured,
        commandTemplateCount: product.commandTemplates.length
      }));
    },
    [] as AdminServerProductRow[]
  );
}

export async function getAdminServerProductFormData(serverId: string, productId?: string) {
  return adminQuery(
    "server-product-form",
    async () => {
      const [server, categories, servers, product] = await Promise.all([
        prisma.server.findUnique({ where: { id: serverId } }),
        prisma.productCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { titleEn: "asc" }] }),
        prisma.server.findMany({ orderBy: [{ sortOrder: "asc" }, { titleEn: "asc" }] }),
        productId
          ? prisma.product.findUnique({
              where: { id: productId },
              include: {
                translations: true,
                productServers: true,
                commandTemplates: {
                  where: { serverId },
                  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
                }
              }
            })
          : null
      ]);

      return {
        server,
        categories,
        servers,
        product
      };
    },
    {
      server: null,
      categories: [],
      servers: [],
      product: null
    }
  );
}
