import { NextRequest, NextResponse } from "next/server";
import { apiRateLimited } from "@/lib/api/responses";
import { buildSteamLoginUrl } from "@/lib/auth/steam";
import { getSafeLocale, getSafeReturnPath } from "@/lib/auth/redirects";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limited = await checkRequestRateLimit({
    request,
    keyPrefix: "auth-steam",
    limit: 30,
    windowSeconds: 60
  });
  if (!limited.allowed) return apiRateLimited();

  const locale = getSafeLocale(request.nextUrl.searchParams.get("locale"));
  const returnTo = getSafeReturnPath(request.nextUrl.searchParams.get("returnTo"), locale);
  const loginUrl = buildSteamLoginUrl({ locale, returnTo });

  return NextResponse.redirect(loginUrl);
}
