import "server-only";

import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export function isRedisConfigured() {
  return Boolean(process.env.REDIS_URL);
}

export function getRedis() {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!globalForRedis.redis) {
    globalForRedis.redis = new Redis(process.env.REDIS_URL!, {
      enableOfflineQueue: false,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null
    });

    globalForRedis.redis.on("error", (error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[redis] ${error.message}`);
      }
    });
  }

  return globalForRedis.redis;
}

export async function connectRedis(redis = getRedis()) {
  if (!redis) {
    return null;
  }

  if (redis.status === "wait" || redis.status === "close" || redis.status === "end") {
    await redis.connect();
  }

  return redis;
}
