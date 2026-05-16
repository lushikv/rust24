import Link from "next/link";
import type { Locale, MoneyRaceSeason } from "@/types/content";
import { formatCurrency, getLocalizedValue } from "@/lib/localized";
import { homeCurrency } from "@/components/home/home-utils";

export function PromoEventCard({
  locale,
  season
}: {
  locale: Locale;
  season: MoneyRaceSeason | null;
}) {
  const copy = getPromoCopy(locale);
  const title = season ? getLocalizedValue(season.title, locale) : copy.title;
  const period = season ? getLocalizedValue(season.activePeriod, locale) : copy.period;
  const prize = season
    ? formatCurrency(season.prizePool[homeCurrency], homeCurrency, locale)
    : copy.prize;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-orange-300/18 bg-[#120f10] p-5 shadow-2xl shadow-black/35 sm:p-7 lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(249,115,22,0.32),transparent_24rem),linear-gradient(115deg,rgba(255,255,255,0.08),transparent_38%,rgba(255,176,0,0.1))]" />
      <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-orange-200/20 bg-orange-500/10 blur-xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200/80">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            {copy.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/money-race`} className="primary-cta">
              {copy.cta}
            </Link>
            <span className="inline-flex items-center rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-black text-zinc-200">
              {period}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-orange-200/20 bg-black/30 p-5 text-center shadow-inner shadow-white/5 sm:min-w-72">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">
            {copy.pool}
          </p>
          <p className="mt-3 text-4xl font-black text-orange-200 sm:text-5xl">
            {prize}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{copy.note}</p>
        </div>
      </div>
    </section>
  );
}

function getPromoCopy(locale: Locale) {
  if (locale === "ru") {
    return {
      eyebrow: "Сезонная гонка",
      title: "Турнир вайпа",
      period: "еженедельные периоды",
      prize: "Бонусы сезона",
      pool: "Пул сезона",
      description:
        "Следи за таблицей лидеров, выбирай формат команды и набирай очки в рамках активного вайпа. Блок готов к реальным правилам сезона, когда они появятся.",
      note: "Без автоматических выплат и доставки на этом этапе.",
      cta: "Таблица лидеров"
    };
  }

  return {
    eyebrow: "Season race",
    title: "Wipe tournament",
    period: "weekly periods",
    prize: "Season bonuses",
    pool: "Season pool",
    description:
      "Track the leaderboard, choose a team format, and score points during the active wipe. The block is ready for real season rules later.",
    note: "No automatic payouts or delivery at this stage.",
    cta: "Leaderboard"
  };
}
