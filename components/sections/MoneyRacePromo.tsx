import Link from "next/link";
import type { Locale, MoneyRaceSeason } from "@/types/content";
import { formatCurrency, getLocalizedValue } from "@/lib/localized";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function MoneyRacePromo({
  locale,
  season
}: {
  locale: Locale;
  season: MoneyRaceSeason;
}) {
  return (
    <SurfaceCard as="section" className="my-10 overflow-hidden border-orange-400/25 p-6 sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-orange-300">
        Money Race
      </p>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            {getLocalizedValue(season.title, locale)}
          </h2>
          <p className="mt-2 text-zinc-300">
            {getLocalizedValue(season.activePeriod, locale)}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-400">{locale === "ru" ? "Призовой фонд" : "Prize pool"}</p>
          <p className="text-3xl font-black text-orange-300">
            {formatCurrency(season.prizePool.RUB, "RUB", locale)}
          </p>
        </div>
      </div>
      <Link
        href={`/${locale}/money-race`}
        className="primary-cta mt-5"
      >
        {locale === "ru" ? "Смотреть таблицу" : "View leaderboard"}
      </Link>
    </SurfaceCard>
  );
}
