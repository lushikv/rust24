import { NextRequest, NextResponse } from "next/server";
import { getCartRequestContext } from "@/lib/cart/cart-context";
import { addCartItem, CartServiceError, getCart } from "@/lib/cart/cart-service";
import { getSafeLocale } from "@/lib/auth/redirects";
import { apiRateLimited } from "@/lib/api/responses";
import { assertSameOriginRequest } from "@/lib/security/origin";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";
import type { Currency } from "@/types/content";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof CartServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Cart request failed." }, { status: 500 });
}

function isCurrency(value: unknown): value is Currency {
  return value === "RUB" || value === "EUR";
}

export async function POST(request: NextRequest) {
  const origin = assertSameOriginRequest(request);
  if (!origin.ok) return origin.response;

  const limited = await checkRequestRateLimit({
    request,
    keyPrefix: "cart-items",
    limit: 60,
    windowSeconds: 60
  });
  if (!limited.allowed) return apiRateLimited();

  const response = NextResponse.json({ ok: true });

  try {
    const body = (await request.json()) as {
      productSlug?: unknown;
      categorySlug?: unknown;
      quantity?: unknown;
      currency?: unknown;
      locale?: unknown;
    };

    if (typeof body.productSlug !== "string" || typeof body.categorySlug !== "string") {
      return NextResponse.json({ error: "Product slug and category slug are required." }, { status: 400 });
    }

    const quantity = typeof body.quantity === "number" ? body.quantity : 1;
    const currency = isCurrency(body.currency) ? body.currency : "RUB";
    const locale = getSafeLocale(typeof body.locale === "string" ? body.locale : null);
    const context = await getCartRequestContext(response);

    await addCartItem({
      userId: context.userId,
      sessionId: context.sessionId,
      productSlug: body.productSlug,
      categorySlug: body.categorySlug,
      quantity,
      currency
    });

    const cart = await getCart({
      userId: context.userId,
      sessionId: context.sessionId,
      locale
    });

    return NextResponse.json(
      { ok: true, cart },
      {
        status: 201,
        headers: response.headers
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
