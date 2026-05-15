import "server-only";

import type { NextRequest } from "next/server";

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const expectedOrigin = request.nextUrl.origin;

  if (origin) {
    return origin === expectedOrigin;
  }

  if (referer) {
    try {
      return new URL(referer).origin === expectedOrigin;
    } catch {
      return false;
    }
  }

  return true;
}

export function assertSameOriginRequest(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return {
      ok: false as const,
      response: Response.json(
        { error: "Cross-origin request is not allowed.", code: "ORIGIN_FORBIDDEN" },
        { status: 403 }
      )
    };
  }

  return { ok: true as const };
}
