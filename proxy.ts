import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/config/locales";

const intlMiddleware = createMiddleware(routing);
const SESSION_COOKIE_NAME = "rust24_session";

export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.cookies.has(SESSION_COOKIE_NAME)) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/ru", request.url);
    redirectUrl.searchParams.set("auth", "required");

    return NextResponse.redirect(redirectUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"]
};
