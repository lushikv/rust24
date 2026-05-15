import { NextRequest, NextResponse } from "next/server";
import { getCartRequestContext } from "@/lib/cart/cart-context";
import { CartServiceError, clearCart, getCart } from "@/lib/cart/cart-service";
import { getSafeLocale } from "@/lib/auth/redirects";
import { apiRateLimited } from "@/lib/api/responses";
import { assertSameOriginRequest } from "@/lib/security/origin";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof CartServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Cart request failed." }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const context = await getCartRequestContext();
  const locale = getSafeLocale(request.nextUrl.searchParams.get("locale"));
  const cart = await getCart({
    userId: context.userId,
    sessionId: context.sessionId,
    locale
  });

  return NextResponse.json({ cart });
}

export async function DELETE(request: NextRequest) {
  const origin = assertSameOriginRequest(request);
  if (!origin.ok) return origin.response;

  const limited = await checkRequestRateLimit({
    request,
    keyPrefix: "cart-clear",
    limit: 30,
    windowSeconds: 60
  });
  if (!limited.allowed) return apiRateLimited();

  try {
    const context = await getCartRequestContext();
    await clearCart({
      userId: context.userId,
      sessionId: context.sessionId
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
