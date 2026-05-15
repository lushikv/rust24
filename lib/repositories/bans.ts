import "server-only";

import { BanStatus } from "@prisma/client";
import { bans as fallbackBans } from "@/data/bans";
import { prisma } from "@/lib/prisma";
import { tryDatabase } from "@/lib/repositories/repository-utils";
import type { BanRecord } from "@/types/content";

function mapBanStatus(status: BanStatus) {
  if (status === BanStatus.APPEALED) {
    return { ru: "Обжалован", en: "Appealed" };
  }
  if (status === BanStatus.EXPIRED) {
    return { ru: "Истек", en: "Expired" };
  }
  return { ru: "Активен", en: "Active" };
}

export async function getBanRecords(): Promise<BanRecord[]> {
  return tryDatabase(
    async () => {
      const rows = await prisma.banRecord.findMany({
        orderBy: { bannedAt: "desc" },
        take: 100
      });

      return rows.map((ban) => ({
        id: ban.id,
        player: ban.playerName,
        reason: { ru: ban.reasonRu, en: ban.reasonEn },
        server: { ru: ban.serverName, en: ban.serverName },
        date: ban.bannedAt.toISOString().slice(0, 10),
        status: mapBanStatus(ban.status)
      }));
    },
    fallbackBans,
    "getBanRecords"
  );
}
