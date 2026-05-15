import "server-only";

import { ServerStatus as PrismaServerStatus, TeamLimit } from "@prisma/client";
import { servers as fallbackServers } from "@/data/servers";
import { prisma } from "@/lib/prisma";
import { tryDatabase } from "@/lib/repositories/repository-utils";
import type { Server } from "@/types/content";

function mapStatus(status: PrismaServerStatus): Server["status"] {
  if (status === PrismaServerStatus.ONLINE) return "online";
  if (status === PrismaServerStatus.MAINTENANCE) return "maintenance";
  return "offline";
}

function mapTeamLimit(limit: TeamLimit) {
  return {
    ru:
      limit === TeamLimit.SOLO
        ? "только соло"
        : limit === TeamLimit.DUO
          ? "до 2 игроков"
          : limit === TeamLimit.TRIO
            ? "до 3 игроков"
            : "без лимита",
    en:
      limit === TeamLimit.SOLO
        ? "solo only"
        : limit === TeamLimit.DUO
          ? "up to 2 players"
          : limit === TeamLimit.TRIO
            ? "up to 3 players"
            : "no limit"
  };
}

export async function getServers(): Promise<Server[]> {
  return tryDatabase(
    async () => {
      const rows = await prisma.server.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          statusSnapshots: {
            orderBy: { capturedAt: "desc" },
            take: 1
          }
        }
      });

      return rows.map((server) => {
        const snapshot = server.statusSnapshots[0];

        return {
          id: server.slug,
          name: { ru: server.titleRu, en: server.titleEn },
          description: {
            ru: server.descriptionRu ?? "",
            en: server.descriptionEn ?? ""
          },
          mode: { ru: server.mode, en: server.mode },
          region: server.region,
          status: snapshot ? mapStatus(snapshot.status) : "offline",
          online: snapshot?.online ?? 0,
          queue: snapshot?.queue ?? 0,
          capacity: server.capacity,
          teamLimit: mapTeamLimit(server.teamLimit),
          wipeSchedule: {
            ru: server.wipeScheduleRu,
            en: server.wipeScheduleEn
          },
          connectCommand: server.connectCommand,
          tags: []
        } satisfies Server;
      });
    },
    fallbackServers,
    "getServers"
  );
}

export async function getFeaturedServers(): Promise<Server[]> {
  const servers = await getServers();
  return servers.slice(0, 3);
}
