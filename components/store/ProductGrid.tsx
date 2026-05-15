import type { Locale, StoreProduct } from "@/types/content";
import { ProductCard } from "@/components/store/ProductCard";

export function ProductGrid({
  products,
  locale
}: {
  products: StoreProduct[];
  locale: Locale;
}) {
  if (products.length === 0) {
    return (
      <div className="surface-card p-6 text-sm text-zinc-300">
        {locale === "ru"
          ? "В этой категории пока нет активных товаров."
          : "There are no active products in this category yet."}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
