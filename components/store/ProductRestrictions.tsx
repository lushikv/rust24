import type { Locale, StoreProductDetail } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";

export function ProductRestrictions({
  product,
  locale
}: {
  product: StoreProductDetail;
  locale: Locale;
}) {
  return (
    <section className="rounded-md border border-orange-500/20 bg-orange-500/10 p-5">
      <h2 className="text-xl font-black text-white">
        {locale === "ru" ? "Ограничения" : "Restrictions"}
      </h2>
      <ul className="mt-4 space-y-3 text-sm text-orange-50">
        {product.modeRestrictions.map((item) => (
          <li key={`${item.ru}-${item.en}`}>{getLocalizedValue(item, locale)}</li>
        ))}
      </ul>
    </section>
  );
}
