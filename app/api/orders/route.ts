import { NextRequest, NextResponse } from "next/server";
import { getCartRequestContext } from "@/lib/cart/cart-context";
import { CartServiceError, createDraftOrderFromCart } from "@/lib/cart/cart-service";
import { getSafeLocale } from "@/lib/auth/redirects";
import { apiRateLimited } from "@/lib/api/responses";
import { assertSameOriginRequest } from "@/lib/security/origin";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof CartServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Order request failed." }, { status: 500 });
}

export async function POST(request: NextRequest) {
  const origin = assertSameOriginRequest(request);
  if (!origin.ok) return origin.response;

  const limited = await checkRequestRateLimit({
    request,
    keyPrefix: "orders",
    limit: 20,
    windowSeconds: 60
  });
  if (!limited.allowed) return apiRateLimited();

  try {
    const context = await getCartRequestContext();
    const body = await request.json().catch(() => ({})) as { locale?: unknown };
    const locale = getSafeLocale(typeof body.locale === "string" ? body.locale : null);
    const order = await createDraftOrderFromCart({
      userId: context.userId,
      sessionId: context.sessionId,
      locale
    });

    return NextResponse.json(
      {
        order: {
          id: order.id,
          status: order.status,
          totalRub: order.totalRub,
          totalEur: order.totalEur
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
