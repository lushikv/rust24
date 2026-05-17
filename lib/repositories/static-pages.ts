import "server-only";

import { prisma } from "@/lib/prisma";

export type PublicStaticPage = {
  slug: string;
  title: {
    ru: string;
    en: string;
  };
  description: {
    ru: string;
    en: string;
  };
  content: {
    ru: string;
    en: string;
  };
  noindex: boolean;
  updatedAt: string;
};

export async function getPublishedStaticPage(slug: string): Promise<PublicStaticPage | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const page = await prisma.staticPage.findUnique({
      where: { slug }
    });

    if (!page?.isPublished) {
      return null;
    }

    return {
      slug: page.slug,
      title: {
        ru: page.titleRu,
        en: page.titleEn
      },
      description: {
        ru: page.descriptionRu ?? page.titleRu,
        en: page.descriptionEn ?? page.titleEn
      },
      content: {
        ru: page.contentRu,
        en: page.contentEn
      },
      noindex: page.noindex,
      updatedAt: page.updatedAt.toISOString()
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[static-page:${slug}] ${message}`);
    }

    return null;
  }
}

export async function getPublishedIndexableStaticPages() {
  if (!process.env.DATABASE_URL) {
    return [] as Array<{ slug: string; updatedAt: Date }>;
  }

  try {
    return await prisma.staticPage.findMany({
      where: {
        isPublished: true,
        noindex: false
      },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[static-pages:sitemap] ${message}`);
    }

    return [] as Array<{ slug: string; updatedAt: Date }>;
  }
}
