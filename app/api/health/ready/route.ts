import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectRedis, isRedisConfigured } from "@/lib/redis";

type DependencyStatus = "ok" | "unavailable" | "not_configured";

async function checkDatabase(): Promise<DependencyStatus> {
  if (!process.env.DATABASE_URL) {
    return "not_configured";
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return "ok";
  } catch {
    return "unavailable";
  }
}

async function checkRedis(): Promise<DependencyStatus> {
  if (!isRedisConfigured()) {
    return "not_configured";
  }

  try {
    const redis = await connectRedis();
    if (!redis) return "not_configured";
    await redis.ping();
    return "ok";
  } catch {
    return "unavailable";
  }
}

export async function GET() {
  const [database, redis] = await Promise.all([checkDatabase(), checkRedis()]);
  const ready = database === "ok" && (redis === "ok" || redis === "not_configured");

  return NextResponse.json(
    {
      ok: ready,
      timestamp: new Date().toISOString(),
      dependencies: {
        database,
        redis
      }
    },
    { status: ready ? 200 : 503 }
  );
}
