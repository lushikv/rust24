import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";
import { getSafeLocale, getSafeReturnPath } from "@/lib/auth/redirects";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const locale = getSafeLocale(request.nextUrl.searchParams.get("locale"));
  const returnTo = getSafeReturnPath(request.nextUrl.searchParams.get("returnTo"), locale);
  const response = NextResponse.redirect(new URL(returnTo === `/${locale}/profile` ? `/${locale}` : returnTo, request.url));
  const sessionCookie = clearSessionCookie();

  response.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.options
  );

  return response;
}

export const POST = GET;
