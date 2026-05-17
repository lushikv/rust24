import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { UserRole } from "@prisma/client";
import type { SessionPayload } from "@/lib/auth/types";

export const ADMIN_ACTION_TOKEN_FIELD = "adminActionToken";
const ADMIN_ACTION_TOKEN_TTL_SECONDS = 15 * 60;

type AdminActionTokenPayload = {
  userId: string;
  steamId: string;
  role: UserRole;
  expiresAt: number;
};

function getSecret() {
  return process.env.AUTH_SESSION_SECRET ?? "";
}

function sign(value: string) {
  const secret = getSecret();

  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET is not configured.");
  }

  return createHmac("sha256", secret).update(value).digest("base64url");
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function isPayload(value: unknown): value is AdminActionTokenPayload {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AdminActionTokenPayload>;

  return (
    typeof candidate.userId === "string" &&
    typeof candidate.steamId === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.expiresAt === "number"
  );
}

export function createAdminActionToken(user: Pick<SessionPayload, "userId" | "steamId" | "role">) {
  const payload: AdminActionTokenPayload = {
    userId: user.userId,
    steamId: user.steamId,
    role: user.role,
    expiresAt: Math.floor(Date.now() / 1000) + ADMIN_ACTION_TOKEN_TTL_SECONDS
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyAdminActionToken(token: string | null) {
  if (!token || !getSecret()) return null;

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  const actualBuffer = Buffer.from(signature, "base64url");
  const expectedBuffer = Buffer.from(expected, "base64url");

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as unknown;

    if (!isPayload(payload)) return null;
    if (payload.expiresAt <= Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
