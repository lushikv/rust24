import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminStaticPageRow = {
  id: string;
  slug: string;
  titleRu: string;
  titleEn: string;
  isPublished: boolean;
  noindex: boolean;
  updatedAt: string;
};

export async function getAdminStaticPages() {
  return adminQuery(
    "static-pages",
    async () => {
      const pages = await prisma.staticPage.findMany({
        orderBy: [{ updatedAt: "desc" }],
        select: {
          id: true,
          slug: true,
          titleRu: true,
          titleEn: true,
          isPublished: true,
          noindex: true,
          updatedAt: true
        }
      });

      return pages.map((page) => ({
        ...page,
        updatedAt: page.updatedAt.toISOString()
      }));
    },
    [] as AdminStaticPageRow[]
  );
}

export async function getAdminStaticPage(pageId: string) {
  return adminQuery(
    "static-page",
    async () =>
      prisma.staticPage.findUnique({
        where: { id: pageId }
      }),
    null
  );
}
