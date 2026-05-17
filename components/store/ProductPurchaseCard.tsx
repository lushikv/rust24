import type { Currency, Locale, StoreProductDetail } from "@/types/content";
import { formatCurrency, getLocalizedValue } from "@/lib/localized";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function ProductPurchaseCard({
  product,
  locale,
  currency = "RUB",
  isAuthenticated = false
}: {
  product: StoreProductDetail;
  locale: Locale;
  currency?: Currency;
  isAuthenticated?: boolean;
}) {
  const price = product.price[currency];
  const oldPrice = currency === "RUB" ? product.oldPriceRub : product.oldPriceEur;

  return (
    <SurfaceCard as="aside" className="p-5 lg:sticky lg:top-32">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-300">
        {getLocalizedValue(product.category.title, locale)}
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <p className="text-4xl font-black text-white">{formatCurrency(price, currency, locale)}</p>
        {oldPrice ? (
          <p className="pb-1 text-lg font-bold text-zinc-500 line-through">
            {formatCurrency(oldPrice, currency, locale)}
          </p>
        ) : null}
      </div>
      {product.discountPercent ? (
        <p className="mt-2 inline-flex rounded bg-orange-500 px-2 py-1 text-xs font-black text-black">
          -{product.discountPercent}%
        </p>
      ) : null}
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{locale === "ru" ? "Тип" : "Type"}</dt>
          <dd className="font-bold text-white">{product.type.replace("_", " ")}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{locale === "ru" ? "Срок" : "Duration"}</dt>
          <dd className="font-bold text-white">{getLocalizedValue(product.duration, locale)}</dd>
        </div>
      </dl>
      {isAuthenticated ? (
        <AddToCartButton product={product} locale={locale} />
      ) : (
        <a
          href={`/api/auth/steam?locale=${locale}&returnTo=/${locale}/store/${product.categorySlug}/${product.slug}`}
          aria-label={locale === "ru" ? "Войти через Steam для будущей покупки" : "Login with Steam for future purchase"}
          className="primary-cta mt-6 w-full"
        >
          {locale === "ru" ? "Войти через Steam" : "Login with Steam"}
        </a>
      )}
      <p className="mt-4 rounded-md border border-white/10 bg-black/25 p-3 text-xs leading-5 text-zinc-400">
        {locale === "ru"
          ? "Оформление заказа и платежный поток будут добавлены на более позднем этапе."
          : "Checkout and payment flow will be added in a later stage."}
      </p>
    </SurfaceCard>
  );
}
