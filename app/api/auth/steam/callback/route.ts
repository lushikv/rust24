import { AuditAction, CurrencyCode, Locale as PrismaLocale } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRateLimited } from "@/lib/api/responses";
import { getSafeLocale, getSafeReturnPath } from "@/lib/auth/redirects";
import { createSessionCookie } from "@/lib/auth/session";
import {
  extractSteamId,
  fetchSteamProfile,
  verifySteamOpenIdResponse
} from "@/lib/auth/steam";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

function redirectWithFailure(request: NextRequest, locale: string, returnTo: string) {
  const url = new URL(returnTo || `/${locale}?auth=failed`, request.url);
  url.searchParams.set("auth", "failed");
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const limited = await checkRequestRateLimit({
    request,
    keyPrefix: "auth-steam-callback",
    limit: 30,
    windowSeconds: 60
  });
  if (!limited.allowed) return apiRateLimited();

  const locale = getSafeLocale(request.nextUrl.searchParams.get("locale"));
  const returnTo = getSafeReturnPath(request.nextUrl.searchParams.get("returnTo"), locale);
  const steamId = extractSteamId(request.nextUrl.searchParams);

  if (!steamId) {
    return redirectWithFailure(request, locale, returnTo);
  }

  try {
    const isValid = await verifySteamOpenIdResponse(request.nextUrl.searchParams);

    if (!isValid) {
      return redirectWithFailure(request, locale, returnTo);
    }

    const steamProfile = await fetchSteamProfile(steamId);
    const existingProfile = await prisma.steamProfile.findUnique({
      where: { steamId },
      include: { user: true }
    });
    const user = existingProfile
      ? await prisma.user.update({
          where: { id: existingProfile.userId },
          data: {
            displayName: steamProfile.personaName,
            steamProfile: {
              update: {
                personaName: steamProfile.personaName,
                avatarUrl: steamProfile.avatarUrl,
                profileUrl: steamProfile.profileUrl
              }
            }
          },
          include: { steamProfile: true }
        })
      : await prisma.user.create({
          data: {
            displayName: steamProfile.personaName,
            locale: locale === "ru" ? PrismaLocale.RU : PrismaLocale.EN,
            currency: CurrencyCode.RUB,
            steamProfile: {
              create: {
                steamId,
                personaName: steamProfile.personaName,
                avatarUrl: steamProfile.avatarUrl,
                profileUrl: steamProfile.profileUrl
              }
            }
          },
          include: { steamProfile: true }
        });

    if (!user.steamProfile) {
      return redirectWithFailure(request, locale, returnTo);
    }

    prisma.auditLog
      .create({
        data: {
          userId: user.id,
          action: AuditAction.LOGIN,
          entityType: "User",
          entityId: user.id,
          message: "Steam login"
        }
      })
      .catch(() => undefined);

    const sessionCookie = createSessionCookie({
      id: user.id,
      steamId,
      role: user.role
    });
    const response = NextResponse.redirect(new URL(returnTo, request.url));
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options
    );

    return response;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[auth] Steam callback failed: ${message}`);
    }

    return redirectWithFailure(request, locale, returnTo);
  }
}
