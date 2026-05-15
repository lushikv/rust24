import "server-only";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import type { AuthUser, PublicSessionUser } from "@/lib/auth/types";
import type { Locale } from "@/config/locales";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await readSession();

  if (!session) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { steamProfile: true }
    });

    if (!user?.steamProfile || user.steamProfile.steamId !== session.steamId) {
      return null;
    }

    return {
      id: user.id,
      steamId: user.steamProfile.steamId,
      displayName: user.displayName ?? user.steamProfile.personaName,
      personaName: user.steamProfile.personaName,
      avatarUrl: user.steamProfile.avatarUrl,
      profileUrl: user.steamProfile.profileUrl,
      role: user.role,
      locale: user.locale,
      currency: user.currency
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[auth] getCurrentUser: ${message}; using unauthenticated state.`);
    }

    return null;
  }
}

export async function requireCurrentUser(locale: Locale): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}?auth=required`);
  }

  return user;
}

export function toPublicSessionUser(user: AuthUser): PublicSessionUser {
  return {
    id: user.id,
    steamId: user.steamId,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    locale: user.locale,
    currency: user.currency
  };
}
