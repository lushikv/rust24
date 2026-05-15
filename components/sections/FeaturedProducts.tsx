import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import type { Locale, Product } from "@/types/content";

export function FeaturedProducts({
  locale,
  products
}: {
  locale: Locale;
  products: Product[];
}) {
  const featured = products.filter((product) => product.featured);

  return (
    <section className="py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="section-title">
          {locale === "ru" ? "Превью магазина" : "Store preview"}
        </h2>
        <Link className="focus-ring rounded-md text-sm font-bold text-orange-300 hover:text-orange-100" href={`/${locale}/store`}>
          {locale === "ru" ? "Открыть магазин" : "Open store"}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
