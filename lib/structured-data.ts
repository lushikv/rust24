import type { Locale } from "@/config/locales";
import type { Currency, StoreProductDetail } from "@/types/content";
import type { BreadcrumbItem } from "@/lib/seo";
import { getBaseUrl, getCanonicalUrl } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { getLocalizedValue } from "@/lib/localized";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

type JsonLdObject = { [key: string]: JsonLdValue };

export function createOrganizationJsonLd(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: getCanonicalUrl(locale, "/"),
    logo: `${getBaseUrl()}${siteConfig.defaultOgImage}`,
    sameAs: []
  };
}

export function createWebSiteJsonLd(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getCanonicalUrl(locale, "/"),
    inLanguage: locale
  };
}

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.url
    }))
  };
}

export function createProductJsonLd(
  product: StoreProductDetail,
  locale: Locale,
  currency: Currency
): JsonLdObject {
  const price = product.price[currency];
  const canonical = getCanonicalUrl(
    locale,
    `/store/${product.categorySlug}/${product.slug}`
  );
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: getLocalizedValue(product.title, locale),
    description: getLocalizedValue(product.description, locale),
    sku: product.slug,
    category: getLocalizedValue(product.category.title, locale),
    offers: {
      "@type": "Offer",
      url: canonical,
      price,
      priceCurrency: currency,
      availability:
        product.status === "ACTIVE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name
      }
    }
  };

  if (product.imageUrl) {
    data.image = product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${getBaseUrl()}${product.imageUrl}`;
  }

  return data;
}
