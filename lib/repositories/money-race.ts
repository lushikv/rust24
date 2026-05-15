import "server-only";

import { moneyRaceSeason as fallbackSeason } from "@/data/money-race";
import { prisma } from "@/lib/prisma";
import { tryDatabase } from "@/lib/repositories/repository-utils";
import type { MoneyRaceSeason, TeamFormat } from "@/types/content";

const formats: TeamFormat[] = ["solo", "duo", "trio", "nolimit"];

export async function getActiveMoneyRaceSeason(): Promise<MoneyRaceSeason> {
  return tryDatabase(
    async () => {
      const season = await prisma.moneyRaceSeason.findFirst({
        where: { isActive: true },
        orderBy: { startsAt: "desc" },
        include: {
          weeks: {
            orderBy: { weekNumber: "asc" }
          },
          entries: {
            orderBy: [{ format: "asc" }, { rank: "asc" }]
          }
        }
      });

      if (!season) {
        return fallbackSeason;
      }

      return {
        id: season.slug,
        title: { ru: season.titleRu, en: season.titleEn },
        activePeriod: {
          ru: `${season.startsAt.toISOString().slice(0, 10)} - ${season.endsAt.toISOString().slice(0, 10)}`,
          en: `${season.startsAt.toISOString().slice(0, 10)} - ${season.endsAt.toISOString().slice(0, 10)}`
        },
        prizePool: {
          RUB: season.prizePoolRub,
          EUR: Math.max(1, Math.round(season.prizePoolRub / 100))
        },
        updatedAt: season.updatedAt.toISOString(),
        rulesSummary: fallbackSeason.rulesSummary,
        leaderboard: Object.fromEntries(
          formats.map((format) => [
            format,
            season.entries
              .filter((entry) => entry.format === format)
              .map((entry) => ({
                rank: entry.rank,
                player: entry.playerName,
                score: entry.points,
                server: { ru: "RUST24", en: "RUST24" }
              }))
          ])
        ) as MoneyRaceSeason["leaderboard"]
      };
    },
    fallbackSeason,
    "getActiveMoneyRaceSeason"
  );
}
