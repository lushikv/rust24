import { createPlaceholderMetadata } from "@/lib/pages";
import type { Locale } from "@/config/locales";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductCategoryCard } from "@/components/store/ProductCategoryCard";
import { ProductGrid } from "@/components/store/ProductGrid";
import {
  getProductCategories,
  getProducts
} from "@/lib/repositories/products";
import { getCurrentUser } from "@/lib/auth/current-user";
import { PageHero } from "@/components/ui/PageHero";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createPlaceholderMetadata("store", locale);
}

export default async function StorePage({ params }: PageProps) {
  const { locale } = await params;
  const [productCategories, products, currentUser] = await Promise.all([
    getProductCategories(locale),
    getProducts(locale),
    getCurrentUser()
  ]);

  return (
    <div className="w-full space-y-8">
      <PageHero
        title={locale === "ru" ? "Магазин RUST24" : "RUST24 Store"}
        description={
          locale === "ru"
            ? "Премиальная витрина будущих товаров RUST24. Корзина работает как skeleton, а реальные платежи и выдача остаются отключены."
            : "A premium showcase for future RUST24 items. Cart skeleton is available, while real payments and delivery remain disabled."
        }
        accent="STORE ARMORY"
      />
      <section className="grid gap-4 md:grid-cols-3">
        {productCategories.map((category) => (
          <ProductCategoryCard key={category.id} category={category} locale={locale} />
        ))}
      </section>
      <ProductGrid
        isAuthenticated={Boolean(currentUser)}
        products={products}
        locale={locale}
      />
      <p className="metal-panel border-orange-500/20 p-4 text-sm text-orange-100">
        {locale === "ru"
          ? "Дисклеймер: это демонстрационный контент без реального оформления покупки."
          : "Disclaimer: this is demonstration content without real checkout."}
      </p>
      <BreadcrumbJsonLd locale={locale} routeKey="store" />
    </div>
  );
}
