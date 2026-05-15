import { createPlaceholderMetadata } from "@/lib/pages";
import type { Locale } from "@/config/locales";
import { MoneyRaceTabs } from "@/components/money-race/MoneyRaceTabs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { formatCurrency, getLocalizedValue } from "@/lib/localized";
import { getActiveMoneyRaceSeason } from "@/lib/repositories/money-race";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createPlaceholderMetadata("moneyRace", locale);
}

export default async function MoneyRacePage({ params }: PageProps) {
  const { locale } = await params;
  const moneyRaceSeason = await getActiveMoneyRaceSeason();

  return (
    <div className="w-full space-y-8">
      <section className="surface-card overflow-hidden border-orange-400/25 p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-orange-300">
          Money Race
        </p>
        <h1 className="page-title mt-3">
          {getLocalizedValue(moneyRaceSeason.title, locale)}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
          {getLocalizedValue(moneyRaceSeason.activePeriod, locale)}
        </p>
        <p className="mt-5 text-4xl font-black text-orange-300">
          {formatCurrency(moneyRaceSeason.prizePool.RUB, "RUB", locale)}
        </p>
      </section>
      <MoneyRaceTabs season={moneyRaceSeason} locale={locale} />
      <section className="surface-card p-5">
        <h2 className="text-2xl font-black text-white">
          {locale === "ru" ? "Краткие правила" : "Rules summary"}
        </h2>
        <ul className="mt-4 space-y-2">
          {moneyRaceSeason.rulesSummary.map((rule) => (
            <li key={getLocalizedValue(rule, locale)} className="text-zinc-300">
              {getLocalizedValue(rule, locale)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-500">
          {locale === "ru" ? "Обновлено: " : "Updated: "}
          {moneyRaceSeason.updatedAt}
        </p>
      </section>
      <BreadcrumbJsonLd locale={locale} routeKey="moneyRace" />
    </div>
  );
}
