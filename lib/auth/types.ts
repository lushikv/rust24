import "server-only";

import type { CurrencyCode, Locale as PrismaLocale, UserRole } from "@prisma/client";

export type SessionPayload = {
  userId: string;
  steamId: string;
  role: UserRole;
  issuedAt: number;
  expiresAt: number;
};

export type AuthUser = {
  id: string;
  steamId: string;
  displayName: string;
  personaName: string;
  avatarUrl: string | null;
  profileUrl: string | null;
  role: UserRole;
  locale: PrismaLocale;
  currency: CurrencyCode;
};

export type PublicSessionUser = {
  id: string;
  steamId: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  locale: PrismaLocale;
  currency: CurrencyCode;
};
