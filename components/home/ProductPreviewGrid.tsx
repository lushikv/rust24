import Link from "next/link";
import type { Currency, Locale, Product, StoreProduct } from "@/types/content";
import { formatCurrency, getLocalizedValue } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { homeCurrency } from "@/components/home/home-utils";

export function ProductPreviewGrid({
  locale,
  products,
  currency = homeCurrency
}: {
  locale: Locale;
  products: Array<Product | StoreProduct>;
  currency?: Currency;
}) {
  const copy = getProductCopy(locale);
  const visibleProducts = products.slice(0, 8);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-200/75">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 section-title">{copy.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{copy.description}</p>
        </div>
        <ButtonLink href={`/${locale}/store`} variant="secondary">
          {copy.all}
        </ButtonLink>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleProducts.map((product, index) => (
          <ProductPreviewCard
            key={product.id}
            currency={currency}
            index={index}
            locale={locale}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

function ProductPreviewCard({
  product,
  locale,
  currency,
  index
}: {
  product: Product | StoreProduct;
  locale: Locale;
  currency: Currency;
  index: number;
}) {
  const title = getLocalizedValue(product.title, locale);
  const href =
    "slug" in product
      ? `/${locale}/store/${product.categorySlug}/${product.slug}`
      : `/${locale}/store/${product.categoryId}/${product.id}`;
  const oldPrice =
    "oldPriceRub" in product && currency === "RUB"
      ? product.oldPriceRub
      : "oldPriceEur" in product && currency === "EUR"
        ? product.oldPriceEur
        : undefined;
  const badge =
    product.discountPercent
      ? `-${product.discountPercent}%`
      : index === 0
        ? locale === "ru"
          ? "Хит"
          : "Hot"
        : index === 1
          ? "Limited"
          : locale === "ru"
            ? "Товар"
            : "Item";

  return (
    <article className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121217]/90 p-4 shadow-2xl shadow-black/25 transition duration-200 hover:-translate-y-1 hover:border-orange-300/45 hover:shadow-[0_22px_60px_rgba(0,0,0,0.35),0_0_28px_rgba(249,115,22,0.12)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-orange-300/20 bg-orange-500/10 text-2xl font-black text-orange-200 shadow-inner shadow-white/5">
          {title.slice(0, 1)}
        </div>
        <Badge variant={product.discountPercent ? "amber" : "muted"}>{badge}</Badge>
      </div>

      <h3 className="mt-4 text-xl font-black text-white">
        <Link className="focus-ring rounded-sm hover:text-orange-200" href={href}>
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-400">
        {getLocalizedValue(product.description, locale)}
      </p>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p
            className={cn(
              "h-5 text-sm font-bold text-zinc-500 line-through",
              !oldPrice && "invisible"
            )}
          >
            {oldPrice
              ? formatCurrency(oldPrice, currency, locale)
              : formatCurrency(product.price[currency], currency, locale)}
          </p>
          <p className="text-2xl font-black text-orange-200">
            {formatCurrency(product.price[currency], currency, locale)}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-zinc-300">
          {getLocalizedValue(product.duration, locale)}
        </span>
      </div>

      <Link href={href} className="primary-cta mt-5 w-full">
        {locale === "ru" ? "Купить" : "Buy"}
      </Link>
    </article>
  );
}

function getProductCopy(locale: Locale) {
  if (locale === "ru") {
    return {
      eyebrow: "Store preview",
      title: "Популярные товары",
      description:
        "Компактная витрина будущих наборов Rust24: цена, срок и ограничения видны сразу.",
      all: "Перейти в магазин"
    };
  }

  return {
    eyebrow: "Store preview",
    title: "Popular items",
    description:
      "A compact preview of future Rust24 items: price, duration, and limits are visible at a glance.",
    all: "Open store"
  };
}
