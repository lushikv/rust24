import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminBanRow = {
  id: string;
  playerName: string;
  reason: string;
  serverName: string;
  status: string;
  bannedAt: string;
  expiresAt: string | null;
};

export async function getAdminBans() {
  return adminQuery(
    "bans",
    async () => {
      const rows = await prisma.banRecord.findMany({
        orderBy: { bannedAt: "desc" },
        take: 100
      });

      return rows.map((ban) => ({
        id: ban.id,
        playerName: ban.playerName,
        reason: ban.reasonEn,
        serverName: ban.serverName,
        status: ban.status,
        bannedAt: ban.bannedAt.toISOString(),
        expiresAt: ban.expiresAt?.toISOString() ?? null
      }));
    },
    [] as AdminBanRow[]
  );
}
