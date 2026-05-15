import Link from "next/link";
import type { Locale, ProductCategory, StoreCategory } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function ProductCategoryCard({
  category,
  locale
}: {
  category: ProductCategory | StoreCategory;
  locale: Locale;
}) {
  const slug = "slug" in category ? category.slug : category.id;
  const title = getLocalizedValue(category.title, locale);

  return (
    <SurfaceCard as="article" interactive className="p-5">
      <h2 className="text-lg font-black text-white">
        <Link
          className="rounded-sm transition hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          href={`/${locale}/store/${slug}`}
          aria-label={
            locale === "ru" ? `Открыть категорию ${title}` : `Open category ${title}`
          }
        >
          {title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        {getLocalizedValue(category.description, locale)}
      </p>
      <Link
        className="focus-ring mt-5 inline-flex rounded-md text-sm font-black text-orange-300 transition hover:text-orange-100"
        href={`/${locale}/store/${slug}`}
      >
        {locale === "ru" ? "Смотреть товары" : "View products"}
      </Link>
    </SurfaceCard>
  );
}
