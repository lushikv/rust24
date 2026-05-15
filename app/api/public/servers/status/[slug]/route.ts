import { NextResponse } from "next/server";
import { getPublicServerStatusBySlug } from "@/lib/server-status/status-service";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "public, max-age=10, stale-while-revalidate=30"
};

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const server = await getPublicServerStatusBySlug(slug);

    if (!server) {
      return NextResponse.json({ ok: false, error: "Server not found." }, { status: 404, headers });
    }

    return NextResponse.json({ ok: true, source: server.source, server }, { headers });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server status is temporarily unavailable." },
      { status: 500, headers }
    );
  }
}
