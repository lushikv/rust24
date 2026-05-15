import "server-only";

import { Locale as PrismaLocale } from "@prisma/client";
import type { Locale } from "@/types/content";

export function toPrismaLocale(locale: Locale) {
  return locale === "ru" ? PrismaLocale.RU : PrismaLocale.EN;
}

export function fromPrismaLocale(locale: PrismaLocale): Locale {
  return locale === PrismaLocale.RU ? "ru" : "en";
}

export async function tryDatabase<T>(
  queryFn: () => Promise<T>,
  fallback: T,
  contextLabel: string
): Promise<T> {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[repositories] ${contextLabel}: DATABASE_URL is missing; using static fallback.`);
    }
    return fallback;
  }

  try {
    return await queryFn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (process.env.NODE_ENV !== "production") {
      console.warn(`[repositories] ${contextLabel}: ${message}; using static fallback.`);
    } else {
      console.warn(`[repositories] ${contextLabel}: database query failed; using static fallback.`);
    }

    return fallback;
  }
}
