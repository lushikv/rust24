import "server-only";

import { connectRedis } from "@/lib/redis";

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: string;
  source: "redis" | "fallback";
};

export async function rateLimit({
  key,
  limit,
  windowSeconds
}: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const resetAt = new Date(Date.now() + windowSeconds * 1000).toISOString();
  let redis: Awaited<ReturnType<typeof connectRedis>>;

  try {
    redis = await connectRedis();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[rate-limit] Redis unavailable: ${message}`);
    }

    return { allowed: true, limit, remaining: limit, resetAt, source: "fallback" };
  }

  if (!redis) {
    return { allowed: true, limit, remaining: limit, resetAt, source: "fallback" };
  }

  try {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);
    const redisResetAt = new Date(Date.now() + Math.max(ttl, 0) * 1000).toISOString();

    return {
      allowed: count <= limit,
      limit,
      remaining: Math.max(limit - count, 0),
      resetAt: redisResetAt,
      source: "redis"
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[rate-limit] ${message}`);
    }

    return { allowed: true, limit, remaining: limit, resetAt, source: "fallback" };
  }
}
