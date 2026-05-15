import { createPlaceholderMetadata } from "@/lib/pages";
import type { Locale } from "@/config/locales";
import { BansTable } from "@/components/bans/BansTable";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getBanRecords } from "@/lib/repositories/bans";
import { PageHero } from "@/components/ui/PageHero";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createPlaceholderMetadata("bans", locale);
}

export default async function BansPage({ params }: PageProps) {
  const { locale } = await params;
  const bans = await getBanRecords();

  return (
    <div className="w-full space-y-8">
      <PageHero
        title={locale === "ru" ? "Баны" : "Bans"}
        description={
          locale === "ru"
            ? "Публичный журнал блокировок с приватным подходом: только нужные поля, без лишних персональных данных."
            : "A public ban log with a privacy-first display: only required fields, no unnecessary personal data."
        }
        accent="PUBLIC LOG"
      />
      <BansTable bans={bans} locale={locale} />
      <p className="metal-panel p-4 text-sm text-zinc-400">
        {locale === "ru"
          ? "Примечание: публичность списка не означает раскрытие личной информации игроков."
          : "Note: a public list does not mean exposing player personal information."}
      </p>
      <BreadcrumbJsonLd locale={locale} routeKey="bans" />
    </div>
  );
}
