import "server-only";

import { routing, type Locale } from "@/config/locales";

export function getSafeLocale(value: string | null): Locale {
  return routing.locales.includes(value as Locale) ? (value as Locale) : routing.defaultLocale;
}

export function getSafeReturnPath(value: string | null, locale: Locale) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return `/${locale}/profile`;
  }

  try {
    const url = new URL(value, "http://localhost");

    if (url.origin !== "http://localhost") {
      return `/${locale}/profile`;
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return `/${locale}/profile`;
  }
}
