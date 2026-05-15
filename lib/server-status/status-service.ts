import "server-only";

import { ServerStatus as PrismaServerStatus } from "@prisma/client";
import { servers as fallbackServers } from "@/data/servers";
import { prisma } from "@/lib/prisma";
import {
  getCachedServerStatus,
  getCachedServerStatuses,
  setCachedServerStatus,
  setCachedServerStatuses
} from "@/lib/server-status/status-cache";
import { queryServerStatus } from "@/lib/server-status/status-query";
import type { Locale } from "@/types/content";
import type { PublicServerStatus, ServerStatusSource } from "@/types/server-status";

const DEFAULT_STATUS_TTL_SECONDS = 30;

function getStatusTtlSeconds() {
  const value = Number(process.env.SERVER_STATUS_CACHE_TTL_SECONDS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_STATUS_TTL_SECONDS;
}

function mapPrismaStatus(status: PrismaServerStatus): PublicServerStatus["status"] {
  if (status === PrismaServerStatus.ONLINE) return "online";
  if (status === PrismaServerStatus.MAINTENANCE) return "maintenance";
  return "offline";
}

function newestCapturedAt(statuses: PublicServerStatus[]) {
  return statuses.reduce((latest, status) => {
    return status.capturedAt > latest ? status.capturedAt : latest;
  }, new Date(0).toISOString());
}

function withSource(statuses: PublicServerStatus[], source: ServerStatusSource) {
  return statuses.map((status) => ({ ...status, source }));
}

async function getDatabaseStatuses(): Promise<PublicServerStatus[] | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
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
        serverId: server.id,
        slug: server.slug,
        status: snapshot ? mapPrismaStatus(snapshot.status) : "offline",
        online: snapshot?.online ?? 0,
        queue: snapshot?.queue ?? 0,
        capacity: server.capacity,
        capturedAt: (snapshot?.capturedAt ?? server.updatedAt).toISOString(),
        source: "database"
      };
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[server-status] database fallback: ${message}`);
    } else {
      console.warn("[server-status] database fallback failed.");
    }

    return null;
  }
}

async function getMockStatuses() {
  const statuses = await Promise.all(fallbackServers.map((server) => queryServerStatus(server)));
  return withSource(statuses, "mock");
}

export async function getPublicServerStatuses(locale?: Locale) {
  void locale;

  const cached = await getCachedServerStatuses();

  if (cached) {
    return {
      source: "redis" as const,
      updatedAt: cached.updatedAt,
      servers: cached.statuses
    };
  }

  const databaseStatuses = await getDatabaseStatuses();
  const statuses = databaseStatuses ?? (await getMockStatuses());
  const source = databaseStatuses ? "database" : "mock";
  const updatedAt = newestCapturedAt(statuses);

  await setCachedServerStatuses(statuses, getStatusTtlSeconds());

  return { source, updatedAt, servers: statuses };
}

export async function getPublicServerStatusBySlug(slug: string, locale?: Locale) {
  const cached = await getCachedServerStatus(slug);

  if (cached) {
    return cached;
  }

  const statuses = await getPublicServerStatuses(locale);
  const status = statuses.servers.find((server) => server.slug === slug);

  if (status) {
    await setCachedServerStatus(slug, status, getStatusTtlSeconds());
  }

  return status ?? null;
}

export async function refreshServerStatuses() {
  const databaseStatuses = await getDatabaseStatuses();
  const statuses = databaseStatuses ?? (await getMockStatuses());
  await setCachedServerStatuses(statuses, getStatusTtlSeconds());

  return {
    source: databaseStatuses ? "database" as const : "mock" as const,
    updatedAt: newestCapturedAt(statuses),
    servers: statuses
  };
}
