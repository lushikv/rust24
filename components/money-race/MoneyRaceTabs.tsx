"use client";

import { useState } from "react";
import type { Locale, MoneyRaceSeason, TeamFormat } from "@/types/content";
import { LeaderboardTable } from "@/components/money-race/LeaderboardTable";

const formats: TeamFormat[] = ["solo", "duo", "trio", "nolimit"];

const labels: Record<TeamFormat, string> = {
  solo: "Solo",
  duo: "Duo",
  trio: "Trio",
  nolimit: "No Limit"
};

export function MoneyRaceTabs({
  season,
  locale
}: {
  season: MoneyRaceSeason;
  locale: Locale;
}) {
  const [format, setFormat] = useState<TeamFormat>("solo");

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Money Race team formats">
        {formats.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={format === item}
            onClick={() => setFormat(item)}
            className={`rounded-md border px-3 py-2 text-sm font-black focus:outline-none focus:ring-2 focus:ring-orange-300 ${
              format === item
                ? "border-orange-500 bg-orange-500 text-black"
                : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-orange-400 hover:text-white"
            }`}
          >
            {labels[item]}
          </button>
        ))}
      </div>
      <LeaderboardTable entries={season.leaderboard[format]} locale={locale} />
    </div>
  );
}
