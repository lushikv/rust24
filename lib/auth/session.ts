import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  getClearSessionCookieOptions,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME
} from "@/lib/auth/cookies";
import type { SessionPayload } from "@/lib/auth/types";

type SessionCookie = {
  name: typeof SESSION_COOKIE_NAME;
  value: string;
  options: ReturnType<typeof getSessionCookieOptions>;
};

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET ?? "";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET is not configured.");
  }

  return createHmac("sha256", secret).update(value).digest("base64url");
}

function verifySignature(value: string, signature: string) {
  const expected = sign(value);
  const actualBuffer = Buffer.from(signature, "base64url");
  const expectedBuffer = Buffer.from(expected, "base64url");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SessionPayload>;

  return (
    typeof candidate.userId === "string" &&
    typeof candidate.steamId === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.issuedAt === "number" &&
    typeof candidate.expiresAt === "number"
  );
}

export function createSessionCookie(user: {
  id: string;
  steamId: string;
  role: SessionPayload["role"];
}): SessionCookie {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + (getSessionCookieOptions().maxAge ?? 0);
  const payload: SessionPayload = {
    userId: user.id,
    steamId: user.steamId,
    role: user.role,
    issuedAt,
    expiresAt
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return {
    name: SESSION_COOKIE_NAME,
    value: `${encodedPayload}.${signature}`,
    options: getSessionCookieOptions()
  };
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token || !getSessionSecret()) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature || !verifySignature(encodedPayload, signature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as unknown;

    if (!isSessionPayload(payload)) {
      return null;
    }

    if (payload.expiresAt <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    options: getClearSessionCookieOptions()
  };
}
