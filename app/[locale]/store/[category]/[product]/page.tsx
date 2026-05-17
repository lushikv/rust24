import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductDetail } from "@/components/store/ProductDetail";
import { ProductGrid } from "@/components/store/ProductGrid";
import { routing, type Locale } from "@/config/locales";
import { products as fallbackProducts } from "@/data/products";
import {
  getProductBySlug,
  getProductsByCategorySlug
} from "@/lib/repositories/products";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createDynamicPageMetadata, getCanonicalUrl } from "@/lib/seo";
import {
  createBreadcrumbJsonLd,
  createProductJsonLd
} from "@/lib/structured-data";
import { getLocalizedValue } from "@/lib/localized";

type PageProps = {
  params: Promise<{
    locale: Locale;
    category: string;
    product: string;
  }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    fallbackProducts.map((product) => ({
      locale,
      category: product.categoryId,
      product: product.id
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category: categorySlug, product: productSlug } = await params;
  const product = await getProductBySlug(categorySlug, productSlug, locale);

  if (!product) {
    return createDynamicPageMetadata({
      locale,
      path: `/store/${categorySlug}/${productSlug}`,
      title: locale === "ru" ? "Товар не найден" : "Product not found",
      description:
        locale === "ru"
          ? "Запрошенный товар магазина RUST24 не найден."
          : "The requested RUST24 store product was not found.",
      index: false
    });
  }

  return createDynamicPageMetadata({
    locale,
    path: `/store/${product.categorySlug}/${product.slug}`,
    title: getLocalizedValue(product.title, locale),
    description: getLocalizedValue(product.shortDescription, locale),
    image: product.imageUrl ?? undefined
  });
}

export default async function StoreProductPage({ params }: PageProps) {
  const { locale, category: categorySlug, product: productSlug } = await params;
  const product = await getProductBySlug(categorySlug, productSlug, locale);

  if (!product) {
    notFound();
  }

  const [relatedProducts, currentUser] = await Promise.all([
    getProductsByCategorySlug(product.categorySlug, locale).then((items) =>
      items.filter((item) => item.slug !== product.slug).slice(0, 3)
    ),
    getCurrentUser()
  ]);
  const productTitle = getLocalizedValue(product.title, locale);
  const categoryTitle = getLocalizedValue(product.category.title, locale);
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
      url: getCanonicalUrl(locale, `/store/${product.categorySlug}`)
    },
    {
      label: productTitle,
      url: getCanonicalUrl(locale, `/store/${product.categorySlug}/${product.slug}`)
    }
  ];

  return (
    <div className="w-full space-y-10">
      <nav aria-label={locale === "ru" ? "Хлебные крошки" : "Breadcrumb"} className="text-sm">
        <Link
          className="font-bold text-orange-300 transition hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          href={`/${locale}/store/${product.categorySlug}`}
        >
          {locale === "ru" ? "Назад в категорию" : "Back to category"}
        </Link>
      </nav>
      <ProductDetail
        isAuthenticated={Boolean(currentUser)}
        product={product}
        locale={locale}
      />
      {relatedProducts.length > 0 ? (
        <section>
          <h2 className="section-title mb-4">
            {locale === "ru" ? "Похожие товары" : "Related products"}
          </h2>
          <ProductGrid
            isAuthenticated={Boolean(currentUser)}
            products={relatedProducts}
            locale={locale}
          />
        </section>
      ) : null}
      <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={createProductJsonLd(product, locale, "RUB")} />
    </div>
  );
}
