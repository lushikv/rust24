import "server-only";

import { Locale as PrismaLocale, ProductStatus } from "@prisma/client";
import {
  productCategories as fallbackCategories,
  products as fallbackProducts
} from "@/data/products";
import { prisma } from "@/lib/prisma";
import { toPrismaLocale, tryDatabase } from "@/lib/repositories/repository-utils";
import type {
  Locale,
  LocalizedString,
  StoreCategory,
  StoreProduct,
  StoreProductType
} from "@/types/content";

type ProductRow = Awaited<ReturnType<typeof findManyProductRows>>[number];

function getFallbackCategories(): StoreCategory[] {
  return fallbackCategories.map((category) => ({
    ...category,
    slug: category.id
  }));
}

function getFallbackProducts(): StoreProduct[] {
  const categories = getFallbackCategories();

  return fallbackProducts.map((product) => {
    const category = categories.find((item) => item.id === product.categoryId) ?? categories[0];
    const oldPriceRub = product.discountPercent
      ? Math.round(product.price.RUB / (1 - product.discountPercent / 100))
      : undefined;
    const oldPriceEur =
      product.discountPercent && product.price.EUR
        ? Math.round(product.price.EUR / (1 - product.discountPercent / 100))
        : undefined;

    return {
      ...product,
      slug: product.id,
      categorySlug: product.categoryId,
      category,
      shortDescription: product.description,
      includedItems: [product.duration],
      modeRestrictions: [product.restrictions],
      priceRub: product.price.RUB,
      priceEur: product.price.EUR,
      oldPriceRub,
      oldPriceEur,
      durationDays: getDurationDays(product.duration.en),
      type: product.categoryId === "cosmetic" ? "SERVICE" : "PRIVILEGE",
      status: "ACTIVE",
      imageUrl: null,
      isFeatured: Boolean(product.featured)
    };
  });
}

function getDurationDays(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function getDiscountPercent(priceRub: number, oldPriceRub: number | null) {
  if (!oldPriceRub || oldPriceRub <= priceRub) {
    return undefined;
  }

  return Math.round(100 - (priceRub / oldPriceRub) * 100);
}

function emptyLocalizedString(): LocalizedString {
  return { ru: "", en: "" };
}

function translationsToLocalizedString(
  translations: ProductRow["translations"],
  field: "title" | "description" | "shortDescription"
): LocalizedString {
  const ru = translations.find((item) => item.locale === PrismaLocale.RU);
  const en = translations.find((item) => item.locale === PrismaLocale.EN);

  return {
    ru: (field === "shortDescription" ? ru?.shortDescription : ru?.[field]) ?? "",
    en: (field === "shortDescription" ? en?.shortDescription : en?.[field]) ?? ""
  };
}

function translationArrayToLocalizedStrings(
  translations: ProductRow["translations"],
  field: "includedItems" | "modeRestrictions"
): LocalizedString[] {
  const ru = translations.find((item) => item.locale === PrismaLocale.RU)?.[field] ?? [];
  const en = translations.find((item) => item.locale === PrismaLocale.EN)?.[field] ?? [];
  const length = Math.max(ru.length, en.length);

  return Array.from({ length }, (_, index) => ({
    ru: ru[index] ?? "",
    en: en[index] ?? ""
  }));
}

function mapCategoryRow(row: {
  slug: string;
  titleRu: string;
  titleEn: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
}): StoreCategory {
  return {
    id: row.slug,
    slug: row.slug,
    title: { ru: row.titleRu, en: row.titleEn },
    description: {
      ru: row.descriptionRu ?? "",
      en: row.descriptionEn ?? ""
    }
  };
}

function mapProductRow(product: ProductRow): StoreProduct {
  const category = mapCategoryRow(product.category);
  const title = translationsToLocalizedString(product.translations, "title");
  const description = translationsToLocalizedString(product.translations, "description");
  const shortDescription = translationsToLocalizedString(product.translations, "shortDescription");
  const modeRestrictions = translationArrayToLocalizedStrings(product.translations, "modeRestrictions");
  const includedItems = translationArrayToLocalizedStrings(product.translations, "includedItems");
  const duration: LocalizedString = product.durationDays
    ? { ru: `${product.durationDays} дней`, en: `${product.durationDays} days` }
    : { ru: "без срока", en: "no duration" };

  return {
    id: product.slug,
    slug: product.slug,
    categoryId: product.category.slug,
    categorySlug: product.category.slug,
    category,
    title,
    description,
    shortDescription: shortDescription.ru || shortDescription.en ? shortDescription : description,
    price: {
      RUB: product.priceRub,
      EUR: product.priceEur ?? Math.max(1, Math.round(product.priceRub / 100))
    },
    priceRub: product.priceRub,
    priceEur: product.priceEur ?? undefined,
    oldPriceRub: product.oldPriceRub ?? undefined,
    oldPriceEur: product.oldPriceEur ?? undefined,
    discountPercent: getDiscountPercent(product.priceRub, product.oldPriceRub),
    duration,
    durationDays: product.durationDays ?? undefined,
    restrictions: modeRestrictions[0] ?? emptyLocalizedString(),
    includedItems,
    modeRestrictions,
    type: product.type as StoreProductType,
    status: product.status,
    imageUrl: product.imageUrl,
    featured: product.isFeatured,
    isFeatured: product.isFeatured
  };
}

async function findManyProductRows() {
  return prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      category: { isActive: true }
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      category: true,
      translations: true
    }
  });
}

async function getProductRowsByCategorySlug(categorySlug: string) {
  return prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      category: {
        slug: categorySlug,
        isActive: true
      }
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      category: true,
      translations: true
    }
  });
}

export async function getProductCategories(locale?: Locale): Promise<StoreCategory[]> {
  if (locale) {
    toPrismaLocale(locale);
  }

  return tryDatabase(
    async () => {
      const rows = await prisma.productCategory.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      });

      return rows.map(mapCategoryRow);
    },
    getFallbackCategories(),
    "getProductCategories"
  );
}

export async function getProductCategoryBySlug(
  categorySlug: string,
  locale?: Locale
): Promise<StoreCategory | null> {
  if (locale) {
    toPrismaLocale(locale);
  }

  const fallback =
    getFallbackCategories().find((category) => category.slug === categorySlug) ?? null;

  return tryDatabase(
    async () => {
      const row = await prisma.productCategory.findFirst({
        where: {
          slug: categorySlug,
          isActive: true
        }
      });

      return row ? mapCategoryRow(row) : null;
    },
    fallback,
    "getProductCategoryBySlug"
  );
}

export async function getProducts(locale?: Locale): Promise<StoreProduct[]> {
  if (locale) {
    toPrismaLocale(locale);
  }

  return tryDatabase(
    async () => {
      const rows = await findManyProductRows();
      return rows.map(mapProductRow);
    },
    getFallbackProducts(),
    "getProducts"
  );
}

export async function getProductsByCategorySlug(
  categorySlug: string,
  locale?: Locale
): Promise<StoreProduct[]> {
  if (locale) {
    toPrismaLocale(locale);
  }

  const fallback = getFallbackProducts().filter((product) => product.categorySlug === categorySlug);

  return tryDatabase(
    async () => {
      const rows = await getProductRowsByCategorySlug(categorySlug);
      return rows.map(mapProductRow);
    },
    fallback,
    "getProductsByCategorySlug"
  );
}

export async function getProductBySlug(
  categorySlug: string,
  productSlug: string,
  locale?: Locale
): Promise<StoreProduct | null> {
  if (locale) {
    toPrismaLocale(locale);
  }

  const fallback =
    getFallbackProducts().find(
      (product) => product.categorySlug === categorySlug && product.slug === productSlug
    ) ?? null;

  return tryDatabase(
    async () => {
      const product = await prisma.product.findFirst({
        where: {
          slug: productSlug,
          status: ProductStatus.ACTIVE,
          category: {
            slug: categorySlug,
            isActive: true
          }
        },
        include: {
          category: true,
          translations: true
        }
      });

      return product ? mapProductRow(product) : null;
    },
    fallback,
    "getProductBySlug"
  );
}

export async function getFeaturedProducts(locale?: Locale): Promise<StoreProduct[]> {
  if (locale) {
    toPrismaLocale(locale);
  }

  return tryDatabase(
    async () => {
      const rows = await prisma.product.findMany({
        where: {
          status: ProductStatus.ACTIVE,
          isFeatured: true,
          category: { isActive: true }
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          category: true,
          translations: true
        },
        take: 2
      });

      return rows.map(mapProductRow);
    },
    getFallbackProducts().filter((product) => product.featured).slice(0, 2),
    "getFeaturedProducts"
  );
}
