import type { MetadataRoute } from "next";
import { routing } from "@/config/locales";
import { publicRoutes } from "@/config/routes";
import {
  productCategories,
  products
} from "@/data/products";
import { getCanonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...publicPageUrls, ...categoryUrls, ...productUrls];
}
