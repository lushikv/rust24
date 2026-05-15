import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { routing } from "@/config/locales";
import { getPublicRoute, type RouteKey } from "@/config/routes";
import { siteConfig } from "@/config/site";

export type BreadcrumbItem = {
  label: string;
  url: string;
};

export type MetadataOptions = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  index?: boolean;
};

export type NoIndexMetadataOptions = Omit<MetadataOptions, "index">;

export function getBaseUrl() {
  return siteConfig.siteUrl.replace(/\/$/, "");
}

export function getLocalizedPath(locale: Locale, path: string) {
  const normalizedPath = path === "/" || path === "" ? "" : path;
  const pathWithSlash = normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;

  return `/${locale}${pathWithSlash}`.replace(/\/$/, "") || `/${locale}`;
}

export function getCanonicalUrl(locale: Locale, path: string) {
  return `${getBaseUrl()}${getLocalizedPath(locale, path)}`;
}

export function getLanguageAlternates(path: string) {
  return {
    ru: getCanonicalUrl("ru", path),
    en: getCanonicalUrl("en", path),
    "x-default": getCanonicalUrl(routing.defaultLocale, path)
  };
}

export function createMetadata({
  locale,
  path,
  title,
  description,
  image,
  index = true
}: MetadataOptions): Metadata {
  const canonical = getCanonicalUrl(locale, path);
  const alternateLocale = routing.locales.filter((item) => item !== locale);
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${getBaseUrl()}${image}`
    : `${getBaseUrl()}${siteConfig.defaultOgImage}`;

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(path)
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale,
      alternateLocale,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: siteConfig.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.twitterHandle,
      images: [imageUrl]
    },
    robots: {
      index,
      follow: index
    }
  };
}

export function createNoIndexMetadata(options: NoIndexMetadataOptions): Metadata {
  return {
    ...createMetadata({ ...options, index: false }),
    robots: {
      index: false,
      follow: false
    }
  };
}

export function createDynamicPageMetadata(options: MetadataOptions): Metadata {
  if (options.index === false) {
    return createNoIndexMetadata(options);
  }

  return createMetadata(options);
}

export async function createPageMetadata(
  routeKey: RouteKey,
  locale: Locale
): Promise<Metadata> {
  const route = getPublicRoute(routeKey);

  if (!route) {
    return createNoIndexMetadata({
      locale,
      path: "/",
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription
    });
  }

  const t = await getTranslations({ locale, namespace: `metadata.${routeKey}` });

  return createMetadata({
    locale,
    path: route.path,
    title: t("title"),
    description: t("description"),
    index: route.index
  });
}

export async function createBreadcrumbItems(
  locale: Locale,
  routeKey: RouteKey
): Promise<BreadcrumbItem[]> {
  const route = getPublicRoute(routeKey);
  const home = await getTranslations({ locale, namespace: "metadata.home" });

  if (!route || route.key === "home") {
    return [
      {
        label: home("breadcrumb"),
        url: getCanonicalUrl(locale, "/")
      }
    ];
  }

  const current = await getTranslations({
    locale,
    namespace: `metadata.${routeKey}`
  });

  return [
    {
      label: home("breadcrumb"),
      url: getCanonicalUrl(locale, "/")
    },
    {
      label: current("breadcrumb"),
      url: getCanonicalUrl(locale, route.path)
    }
  ];
}
