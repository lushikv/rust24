import { NextRequest, NextResponse } from "next/server";
import { getCartRequestContext } from "@/lib/cart/cart-context";
import {
  CartServiceError,
  getCart,
  removeCartItem,
  updateCartItemQuantity
} from "@/lib/cart/cart-service";
import { getSafeLocale } from "@/lib/auth/redirects";
import { apiRateLimited } from "@/lib/api/responses";
import { assertSameOriginRequest } from "@/lib/security/origin";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";

type RouteProps = {
  params: Promise<{ itemId: string }>;
};

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof CartServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Cart request failed." }, { status: 500 });
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const origin = assertSameOriginRequest(request);
  if (!origin.ok) return origin.response;

  const limited = await checkRequestRateLimit({
    request,
    keyPrefix: "cart-item-update",
    limit: 90,
    windowSeconds: 60
  });
  if (!limited.allowed) return apiRateLimited();

  try {
    const { itemId } = await params;
    const body = (await request.json()) as {
      quantity?: unknown;
      locale?: unknown;
    };

    if (typeof body.quantity !== "number") {
      return NextResponse.json({ error: "Quantity is required." }, { status: 400 });
    }

    const context = await getCartRequestContext();
    const locale = getSafeLocale(typeof body.locale === "string" ? body.locale : null);

    await updateCartItemQuantity({
      userId: context.userId,
      sessionId: context.sessionId,
      itemId,
      quantity: body.quantity
    });

    const cart = await getCart({
      userId: context.userId,
      sessionId: context.sessionId,
      locale
    });

    return NextResponse.json({ ok: true, cart });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  const origin = assertSameOriginRequest(request);
  if (!origin.ok) return origin.response;

  const limited = await checkRequestRateLimit({
    request,
    keyPrefix: "cart-item-delete",
    limit: 90,
    windowSeconds: 60
  });
  if (!limited.allowed) return apiRateLimited();

  try {
    const { itemId } = await params;
    const context = await getCartRequestContext();
    const locale = getSafeLocale(request.nextUrl.searchParams.get("locale"));

    await removeCartItem({
      userId: context.userId,
      sessionId: context.sessionId,
      itemId
    });

    const cart = await getCart({
      userId: context.userId,
      sessionId: context.sessionId,
      locale
    });

    return NextResponse.json({ ok: true, cart });
  } catch (error) {
    return errorResponse(error);
  }
}
