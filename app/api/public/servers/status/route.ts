import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getPublicServerStatuses } from "@/lib/server-status/status-service";

export const dynamic = "force-dynamic";

function cacheHeaders() {
  return {
    "Cache-Control": "public, max-age=10, stale-while-revalidate=30"
  };
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const limited = await rateLimit({
      key: `rust24:rate-limit:public-server-status:${ip}`,
      limit: 120,
      windowSeconds: 60
    });

    if (!limited.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many requests." },
        { status: 429, headers: cacheHeaders() }
      );
    }

    const result = await getPublicServerStatuses();

    return NextResponse.json(
      {
        ok: true,
        source: result.source,
        updatedAt: result.updatedAt,
        servers: result.servers
      },
      { headers: cacheHeaders() }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server status is temporarily unavailable." },
      { status: 500, headers: cacheHeaders() }
    );
  }
}
