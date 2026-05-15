import "server-only";

import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function checkRequestRateLimit({
  request,
  keyPrefix,
  limit,
  windowSeconds
}: {
  request: NextRequest;
  keyPrefix: string;
  limit: number;
  windowSeconds: number;
}) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

  return rateLimit({
    key: `rust24:rate-limit:${keyPrefix}:${ip}`,
    limit,
    windowSeconds
  });
}
