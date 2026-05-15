import "server-only";

import { faqCategories, faqs } from "@/data/faqs";
import { prisma } from "@/lib/prisma";
import { tryDatabase } from "@/lib/repositories/repository-utils";
import type { FAQCategory, FAQCategoryWithItems, FAQItem } from "@/types/content";

const fallbackCategoriesWithItems: FAQCategoryWithItems[] = faqCategories.map(
  (category) => ({
    ...category,
    items: faqs.filter((faq) => faq.categoryId === category.id)
  })
);

export async function getFAQCategoriesWithArticles(): Promise<FAQCategoryWithItems[]> {
  return tryDatabase(
    async () => {
      const rows = await prisma.fAQCategory.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          articles: {
            where: { isPublished: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
          }
        }
      });

      return rows.map((category) => ({
        id: category.slug,
        title: { ru: category.titleRu, en: category.titleEn },
        items: category.articles.map((article) => ({
          id: article.slug,
          categoryId: category.slug,
          question: { ru: article.questionRu, en: article.questionEn },
          answer: { ru: article.answerRu, en: article.answerEn }
        }))
      }));
    },
    fallbackCategoriesWithItems,
    "getFAQCategoriesWithArticles"
  );
}

export async function getFAQCategories(): Promise<FAQCategory[]> {
  const categories = await getFAQCategoriesWithArticles();
  return categories.map((category) => ({
    id: category.id,
    title: category.title
  }));
}

export async function getFAQItems(): Promise<FAQItem[]> {
  const categories = await getFAQCategoriesWithArticles();
  return categories.flatMap((category) => category.items);
}

export async function getFAQPreview(): Promise<FAQItem[]> {
  const items = await getFAQItems();
  return items.slice(0, 3);
}
