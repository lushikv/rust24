import type { MetadataRoute } from "next";
import { routing } from "@/config/locales";
import { publicRoutes } from "@/config/routes";
import {
  productCategories,
  products
} from "@/data/products";
import { getPublishedIndexableStaticPages } from "@/lib/repositories/static-pages";
import { getCanonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicPageUrls = routing.locales.flatMap((locale) =>
    publicRoutes.filter((route) => route.sitemap && route.index).map((route) => ({
      url: getCanonicalUrl(locale, route.path),
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority
    }))
  );

  const categoryUrls = routing.locales.flatMap((locale) =>
    productCategories.map((category) => ({
      url: getCanonicalUrl(locale, `/store/${category.id}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.65
    }))
  );

  const productUrls = routing.locales.flatMap((locale) =>
    products.map((product) => ({
      url: getCanonicalUrl(locale, `/store/${product.categoryId}/${product.id}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6
    }))
  );

  const staticPages = await getPublishedIndexableStaticPages();
  const staticPageUrls = routing.locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: getCanonicalUrl(locale, `/pages/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.35
    }))
  );

  return [...publicPageUrls, ...categoryUrls, ...productUrls, ...staticPageUrls];
}
