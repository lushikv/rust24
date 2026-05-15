import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminMoneyRaceRow = {
  id: string;
  slug: string;
  title: string;
  prizePoolRub: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  entriesCount: number;
};

export async function getAdminMoneyRaceSeasons() {
  return adminQuery(
    "money-race",
    async () => {
      const rows = await prisma.moneyRaceSeason.findMany({
        orderBy: { startsAt: "desc" },
        include: { entries: true }
      });

      return rows.map((season) => ({
        id: season.id,
        slug: season.slug,
        title: season.titleEn,
        prizePoolRub: season.prizePoolRub,
        startsAt: season.startsAt.toISOString(),
        endsAt: season.endsAt.toISOString(),
        isActive: season.isActive,
        entriesCount: season.entries.length
      }));
    },
    [] as AdminMoneyRaceRow[]
  );
}
