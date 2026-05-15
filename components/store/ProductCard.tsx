import Link from "next/link";
import type { Currency, Locale, Product, StoreProduct } from "@/types/content";
import { formatCurrency, getLocalizedValue } from "@/lib/localized";
import { Badge } from "@/components/ui/Badge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function ProductCard({
  product,
  locale,
  currency = "RUB"
}: {
  product: Product | StoreProduct;
  locale: Locale;
  currency?: Currency;
}) {
  const href =
    "slug" in product
      ? `/${locale}/store/${product.categorySlug}/${product.slug}`
      : `/${locale}/store/${product.categoryId}/${product.id}`;
  const title = getLocalizedValue(product.title, locale);

  return (
    <SurfaceCard as="article" interactive className="relative overflow-hidden p-5">
      {product.discountPercent ? (
        <span className="absolute right-4 top-4 rounded-sm bg-orange-500 px-2 py-1 text-xs font-black text-black">
          -{product.discountPercent}%
        </span>
      ) : null}
      <Badge variant="amber" className="mb-4">{locale === "ru" ? "Товар" : "Item"}</Badge>
      <h2 className="pr-16 text-xl font-black text-white">
        <Link
          className="rounded-sm transition hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          href={href}
          aria-label={
            locale === "ru" ? `Открыть товар ${title}` : `Open product ${title}`
          }
        >
          {title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{getLocalizedValue(product.description, locale)}</p>
      <p className="mt-5 text-3xl font-black text-orange-300">
        {formatCurrency(product.price[currency], currency, locale)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{getLocalizedValue(product.duration, locale)}</Badge>
        <Badge variant="muted">{getLocalizedValue(product.restrictions, locale)}</Badge>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{locale === "ru" ? "Срок" : "Duration"}</dt>
          <dd className="font-bold text-white">{getLocalizedValue(product.duration, locale)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{locale === "ru" ? "Ограничения" : "Limits"}</dt>
          <dd className="text-right font-bold text-white">{getLocalizedValue(product.restrictions, locale)}</dd>
        </div>
      </dl>
      <Link
        href={href}
        className="secondary-cta mt-5 w-full"
      >
        {locale === "ru" ? "Подробнее" : "Details"}
      </Link>
      <a
        href="#"
        className="primary-cta mt-3 w-full"
      >
        {locale === "ru" ? "Войти через Steam" : "Login with Steam"}
      </a>
    </SurfaceCard>
  );
}
