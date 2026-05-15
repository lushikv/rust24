import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGrid } from "@/components/store/ProductGrid";
import { routing, type Locale } from "@/config/locales";
import { productCategories } from "@/data/products";
import {
  getProductCategoryBySlug,
  getProductsByCategorySlug
} from "@/lib/repositories/products";
import { createDynamicPageMetadata, getCanonicalUrl } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/structured-data";
import { getLocalizedValue } from "@/lib/localized";
import { PageHero } from "@/components/ui/PageHero";

type PageProps = {
  params: Promise<{
    locale: Locale;
    category: string;
  }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    productCategories.map((category) => ({
      locale,
      category: category.id
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const category = await getProductCategoryBySlug(categorySlug, locale);

  if (!category) {
    return createDynamicPageMetadata({
      locale,
      path: `/store/${categorySlug}`,
      title: locale === "ru" ? "Категория не найдена" : "Category not found",
      description:
        locale === "ru"
          ? "Запрошенная категория магазина RUST24 не найдена."
          : "The requested RUST24 store category was not found.",
      index: false
    });
  }

  const title = getLocalizedValue(category.title, locale);

  return createDynamicPageMetadata({
    locale,
    path: `/store/${category.slug}`,
    title: `${title} - ${locale === "ru" ? "магазин RUST24" : "RUST24 Store"}`,
    description: getLocalizedValue(category.description, locale)
  });
}

export default async function StoreCategoryPage({ params }: PageProps) {
  const { locale, category: categorySlug } = await params;
  const [category, products] = await Promise.all([
    getProductCategoryBySlug(categorySlug, locale),
    getProductsByCategorySlug(categorySlug, locale)
  ]);

  if (!category) {
    notFound();
  }

  const categoryTitle = getLocalizedValue(category.title, locale);
  const breadcrumbs = [
    {
      label: locale === "ru" ? "Главная" : "Home",
      url: getCanonicalUrl(locale, "/")
    },
    {
      label: locale === "ru" ? "Магазин" : "Store",
      url: getCanonicalUrl(locale, "/store")
    },
    {
      label: categoryTitle,
      url: getCanonicalUrl(locale, `/store/${category.slug}`)
    }
  ];

  return (
    <div className="w-full space-y-8">
      <nav aria-label={locale === "ru" ? "Хлебные крошки" : "Breadcrumb"} className="text-sm">
        <Link
          className="font-bold text-orange-300 transition hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          href={`/${locale}/store`}
        >
          {locale === "ru" ? "Назад в магазин" : "Back to store"}
        </Link>
      </nav>
      <PageHero
        title={categoryTitle}
        description={getLocalizedValue(category.description, locale)}
        accent="STORE CATEGORY"
      />
      <ProductGrid products={products} locale={locale} />
      <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} />
    </div>
  );
}
