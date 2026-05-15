import Link from "next/link";
import { createPlaceholderMetadata } from "@/lib/pages";
import type { Locale } from "@/config/locales";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { GameModeCard } from "@/components/gamemodes/GameModeCard";
import { getGameModes } from "@/lib/repositories/gamemodes";
import { PageHero } from "@/components/ui/PageHero";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createPlaceholderMetadata("gamemodes", locale);
}

export default async function GameModesPage({ params }: PageProps) {
  const { locale } = await params;
  const gamemodes = await getGameModes();

  return (
    <div className="w-full space-y-8">
      <PageHero
        title={locale === "ru" ? "Игровые режимы" : "Game Modes"}
        description={
          locale === "ru"
            ? "Разные темпы вайпа, лимиты команды и ожидания от прогресса, собранные в понятную сетку режимов."
            : "Different wipe pacing, team limits, and progression expectations arranged into a clear mode grid."
        }
        accent="TACTICAL MODES"
      >
        <div className="mt-5 flex gap-3 text-sm font-bold">
          <Link href={`/${locale}/servers`} className="text-orange-300 hover:text-orange-200">
            {locale === "ru" ? "Перейти к серверам" : "Go to servers"}
          </Link>
          <Link href={`/${locale}/store`} className="text-zinc-300 hover:text-white">
            {locale === "ru" ? "Открыть магазин" : "Open store"}
          </Link>
        </div>
      </PageHero>
      <section className="grid gap-4 lg:grid-cols-3">
        {gamemodes.map((mode) => (
          <GameModeCard key={mode.id} mode={mode} locale={locale} />
        ))}
      </section>
      <BreadcrumbJsonLd locale={locale} routeKey="gamemodes" />
    </div>
  );
}
