import "server-only";

import { connectRedis } from "@/lib/redis";
import {
  SERVER_STATUS_ALL_KEY,
  getServerStatusKey
} from "@/lib/server-status/status-keys";
import type {
  PublicServerStatus,
  ServerStatusCachePayload
} from "@/types/server-status";

async function safeRedis<T>(operation: () => Promise<T>, fallback: T) {
  try {
    return await operation();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[server-status-cache] ${message}`);
    }

    return fallback;
  }
}

export async function getCachedServerStatuses() {
  const redis = await connectRedis();

  if (!redis) {
    return null;
  }

  return safeRedis(async () => {
    const raw = await redis.get(SERVER_STATUS_ALL_KEY);
    if (!raw) return null;

    const payload = JSON.parse(raw) as ServerStatusCachePayload;
    return {
      updatedAt: payload.updatedAt,
      statuses: payload.statuses.map((status) => ({ ...status, source: "redis" as const }))
    };
  }, null);
}

export async function setCachedServerStatuses(
  statuses: PublicServerStatus[],
  ttlSeconds: number
) {
  const redis = await connectRedis();

  if (!redis) {
    return;
  }

  await safeRedis(async () => {
    const updatedAt = new Date().toISOString();
    const payload: ServerStatusCachePayload = { updatedAt, statuses };
    await redis.set(SERVER_STATUS_ALL_KEY, JSON.stringify(payload), "EX", ttlSeconds);
    await Promise.all(
      statuses.map((status) =>
        redis.set(getServerStatusKey(status.slug), JSON.stringify(status), "EX", ttlSeconds)
      )
    );
  }, undefined);
}

export async function getCachedServerStatus(slug: string) {
  const redis = await connectRedis();

  if (!redis) {
    return null;
  }

  return safeRedis(async () => {
    const raw = await redis.get(getServerStatusKey(slug));
    if (!raw) return null;

    const status = JSON.parse(raw) as PublicServerStatus;
    return { ...status, source: "redis" as const };
  }, null);
}

export async function setCachedServerStatus(
  slug: string,
  status: PublicServerStatus,
  ttlSeconds: number
) {
  const redis = await connectRedis();

  if (!redis) {
    return;
  }

  await safeRedis(async () => {
    await redis.set(getServerStatusKey(slug), JSON.stringify(status), "EX", ttlSeconds);
  }, undefined);
}
