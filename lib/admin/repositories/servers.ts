import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminServerRow = {
  id: string;
  title: string;
  slug: string;
  mode: string;
  region: string;
  teamLimit: string;
  isActive: boolean;
  isFeatured: boolean;
  latestStatus: string;
};

export async function getAdminServers() {
  return adminQuery(
    "servers",
    async () => {
      const rows = await prisma.server.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
          statusSnapshots: {
            orderBy: { capturedAt: "desc" },
            take: 1
          }
        }
      });

      return rows.map((server) => ({
        id: server.id,
        title: server.titleEn,
        slug: server.slug,
        mode: server.mode,
        region: server.region,
        teamLimit: server.teamLimit,
        isActive: server.isActive,
        isFeatured: server.isFeatured,
        latestStatus: server.statusSnapshots[0]?.status ?? "NO_SNAPSHOT"
      }));
    },
    [] as AdminServerRow[]
  );
}
