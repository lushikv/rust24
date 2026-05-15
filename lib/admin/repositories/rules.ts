import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminRuleSectionRow = {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  itemCount: number;
};

export async function getAdminRuleSections() {
  return adminQuery(
    "rules",
    async () => {
      const rows = await prisma.ruleSection.findMany({
        orderBy: { sortOrder: "asc" },
        include: { items: true }
      });

      return rows.map((section) => ({
        id: section.id,
        slug: section.slug,
        title: section.titleEn,
        isPublished: section.isPublished,
        itemCount: section.items.length
      }));
    },
    [] as AdminRuleSectionRow[]
  );
}
