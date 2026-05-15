import Link from "next/link";
import { createPlaceholderMetadata } from "@/lib/pages";
import type { Locale } from "@/config/locales";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { RulesSection } from "@/components/rules/RulesSection";
import {
  getRuleSections,
  getRulesLastUpdated
} from "@/lib/repositories/rules";
import { PageHero } from "@/components/ui/PageHero";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createPlaceholderMetadata("rules", locale);
}

export default async function RulesPage({ params }: PageProps) {
  const { locale } = await params;
  const [ruleSections, rulesLastUpdated] = await Promise.all([
    getRuleSections(),
    getRulesLastUpdated()
  ]);

  return (
    <div className="w-full space-y-8">
      <PageHero
        title={locale === "ru" ? "Правила RUST24" : "RUST24 Rules"}
        description={
          locale === "ru"
            ? "Чёткие правила поведения для честной игры, быстрых вайпов и спокойного старта."
            : "Clear conduct rules for fair play, fast wipes, and a cleaner start."
        }
        accent="RULESET"
      >
        <p className="text-sm text-zinc-500">
          {locale === "ru" ? "Обновлено: " : "Updated: "}
          {rulesLastUpdated}
        </p>
      </PageHero>
      <section className="grid gap-4">
        {ruleSections.map((section) => (
          <RulesSection key={section.id} section={section} locale={locale} />
        ))}
      </section>
      <Link href={`/${locale}/support`} className="primary-cta">
        {locale === "ru" ? "Связаться с поддержкой" : "Contact support"}
      </Link>
      <BreadcrumbJsonLd locale={locale} routeKey="rules" />
    </div>
  );
}
