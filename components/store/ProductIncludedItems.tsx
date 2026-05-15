import type { Locale, StoreProductDetail } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";

export function ProductIncludedItems({
  product,
  locale
}: {
  product: StoreProductDetail;
  locale: Locale;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-xl font-black text-white">
        {locale === "ru" ? "Что входит" : "Included"}
      </h2>
      <ul className="mt-4 space-y-3 text-sm text-zinc-300">
        {product.includedItems.map((item) => (
          <li key={`${item.ru}-${item.en}`} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
            <span>{getLocalizedValue(item, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
