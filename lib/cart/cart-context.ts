import "server-only";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createCartSessionCookie, readCartSessionId } from "@/lib/cart/cart-cookie";
import { CartServiceError } from "@/lib/cart/cart-service";

export async function getCartRequestContext(response?: NextResponse) {
  const user = await getCurrentUser();
  const existingSessionId = await readCartSessionId();

  if (user) {
    return {
      user,
      userId: user.id,
      sessionId: existingSessionId
    };
  }

  if (existingSessionId) {
    return {
      user: null,
      userId: null,
      sessionId: existingSessionId
    };
  }

  if (!response) {
    return {
      user: null,
      userId: null,
      sessionId: null
    };
  }

  let cookie: ReturnType<typeof createCartSessionCookie>;

  try {
    cookie = createCartSessionCookie();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[cart] session cookie failed: ${message}`);
    }

    throw new CartServiceError("Cart session is unavailable.", 503);
  }

  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return {
    user: null,
    userId: null,
    sessionId: cookie.sessionId
  };
}
