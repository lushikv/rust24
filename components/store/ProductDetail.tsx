import Link from "next/link";
import type { Locale, StoreProductDetail } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";
import { ProductIncludedItems } from "@/components/store/ProductIncludedItems";
import { ProductPurchaseCard } from "@/components/store/ProductPurchaseCard";
import { ProductRestrictions } from "@/components/store/ProductRestrictions";

export function ProductDetail({
  product,
  locale
}: {
  product: StoreProductDetail;
  locale: Locale;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <div>
          <Link
            className="text-sm font-bold text-orange-300 transition hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            href={`/${locale}/store/${product.categorySlug}`}
          >
            {getLocalizedValue(product.category.title, locale)}
          </Link>
          <h1 className="page-title mt-3">
            {getLocalizedValue(product.title, locale)}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
            {getLocalizedValue(product.description, locale)}
          </p>
        </div>
        <ProductIncludedItems product={product} locale={locale} />
        <ProductRestrictions product={product} locale={locale} />
      </div>
      <ProductPurchaseCard product={product} locale={locale} />
    </div>
  );
}
