import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminFAQRow = {
  id: string;
  category: string;
  slug: string;
  question: string;
  isPublished: boolean;
};

export async function getAdminFAQ() {
  return adminQuery(
    "faq",
    async () => {
      const rows = await prisma.fAQArticle.findMany({
        orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
        include: { category: true }
      });

      return rows.map((article) => ({
        id: article.id,
        category: article.category.titleEn,
        slug: article.slug,
        question: article.questionEn,
        isPublished: article.isPublished
      }));
    },
    [] as AdminFAQRow[]
  );
}
