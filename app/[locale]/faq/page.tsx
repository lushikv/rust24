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
      <section className="surface-card grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="amber-badge">
            {locale === "ru" ? "Правила проекта" : "Project rules"}
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            {locale === "ru" ? "Нужны правила?" : "Need the rules?"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
            {locale === "ru"
              ? "Основные требования к игре, модерации и честному поведению собраны в отдельном разделе."
              : "Gameplay, moderation, and fair-play requirements are collected in a dedicated section."}
          </p>
        </div>
        <Link href={`/${locale}/rules`} className="primary-cta">
          {locale === "ru" ? "Открыть правила" : "Open rules"}
        </Link>
      </section>
      <BreadcrumbJsonLd locale={locale} routeKey="faq" />
    </div>
  );
}
