import "server-only";

import {
  ruleSections as fallbackRuleSections,
  rulesLastUpdated
} from "@/data/rules";
import { prisma } from "@/lib/prisma";
import { tryDatabase } from "@/lib/repositories/repository-utils";
import type { RuleSection } from "@/types/content";

export async function getRuleSections(): Promise<RuleSection[]> {
  return tryDatabase(
    async () => {
      const rows = await prisma.ruleSection.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          items: {
            orderBy: { sortOrder: "asc" }
          }
        }
      });

      return rows.map((section) => ({
        id: section.slug,
        title: { ru: section.titleRu, en: section.titleEn },
        description: {
          ru: section.descriptionRu ?? "",
          en: section.descriptionEn ?? ""
        },
        severity: section.items.some((item) => item.severity === "warning")
          ? "warning"
          : "info",
        items: section.items.map((item) => ({
          ru: item.textRu,
          en: item.textEn
        }))
      }));
    },
    fallbackRuleSections,
    "getRuleSections"
  );
}

export async function getRulesLastUpdated(): Promise<string> {
  return tryDatabase(
    async () => {
      const latest = await prisma.ruleSection.findFirst({
        where: { isPublished: true },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true }
      });

      return latest?.updatedAt.toISOString().slice(0, 10) ?? rulesLastUpdated;
    },
    rulesLastUpdated,
    "getRulesLastUpdated"
  );
}
