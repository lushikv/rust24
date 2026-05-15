import Link from "next/link";
import { createPlaceholderMetadata } from "@/lib/pages";
import type { Locale } from "@/config/locales";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { getLocalizedValue } from "@/lib/localized";
import {
  getFAQCategories,
  getFAQItems
} from "@/lib/repositories/faq";
import { PageHero } from "@/components/ui/PageHero";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createPlaceholderMetadata("faq", locale);
}

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  const [faqCategories, faqs] = await Promise.all([
    getFAQCategories(),
    getFAQItems()
  ]);

  return (
    <div className="w-full space-y-8">
      <PageHero
        title="FAQ"
        description={
          locale === "ru"
            ? "Короткие ответы о серверах, магазине, правилах и будущих игровых разделах RUST24."
            : "Short answers about servers, store, rules, and future RUST24 game sections."
        }
        accent="FIELD NOTES"
      />
      <section className="flex flex-wrap gap-2" aria-label="FAQ categories">
        {faqCategories.map((category) => (
          <span key={category.id} className="tactical-badge">
            {getLocalizedValue(category.title, locale)}
          </span>
        ))}
      </section>
      <FaqAccordion items={faqs} locale={locale} />
      <section className="surface-card p-5">
        <h2 className="text-2xl font-black text-white">
          {locale === "ru" ? "Нужна помощь?" : "Need help?"}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          {["servers", "store", "rules", "support"].map((path) => (
            <Link key={path} href={`/${locale}/${path}`} className="text-orange-300 hover:text-orange-200">
              /{path}
            </Link>
          ))}
        </div>
      </section>
      <BreadcrumbJsonLd locale={locale} routeKey="faq" />
    </div>
  );
}
