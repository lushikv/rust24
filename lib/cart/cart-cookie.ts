import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const CART_COOKIE_NAME = "rust24_cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getCartSecret() {
  return process.env.AUTH_SESSION_SECRET ?? "";
}

function sign(value: string) {
  const secret = getCartSecret();

  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET is not configured.");
  }

  return createHmac("sha256", secret).update(value).digest("base64url");
}

function verify(value: string, signature: string) {
  const expected = sign(value);
  const actualBuffer = Buffer.from(signature, "base64url");
  const expectedBuffer = Buffer.from(expected, "base64url");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function getCartCookieOptions(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE
  };
}

export function createCartSessionCookie(sessionId = randomUUID()) {
  return {
    name: CART_COOKIE_NAME,
    value: `${sessionId}.${sign(sessionId)}`,
    sessionId,
    options: getCartCookieOptions()
  };
}

export async function readCartSessionId() {
  const cookieStore = await cookies();
  const value = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!value || !getCartSecret()) {
    return null;
  }

  const [sessionId, signature] = value.split(".");

  if (!sessionId || !signature) {
    return null;
  }

  try {
    return verify(sessionId, signature) ? sessionId : null;
  } catch {
    return null;
  }
}
