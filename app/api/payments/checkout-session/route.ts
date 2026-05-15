import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { apiRateLimited } from "@/lib/api/responses";
import { IdempotencyScope, runWithIdempotency } from "@/lib/payments/idempotency";
import { PaymentError, toPaymentError } from "@/lib/payments/payment-errors";
import { createCheckoutSession } from "@/lib/payments/payment-service";
import { assertSameOriginRequest } from "@/lib/security/origin";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

const checkoutSessionSchema = z.object({
  orderId: z.string().min(1),
  locale: z.enum(["ru", "en"]),
  returnUrl: z.string().startsWith("/").optional()
});

function errorResponse(error: unknown) {
  if (error instanceof PaymentError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    );
  }

  const paymentError = toPaymentError(error);
  return NextResponse.json(
    { error: paymentError.message, code: paymentError.code },
    { status: paymentError.status }
  );
}

export async function POST(request: NextRequest) {
  try {
    const origin = assertSameOriginRequest(request);
    if (!origin.ok) return origin.response;

    const limited = await checkRequestRateLimit({
      request,
      keyPrefix: "payment-checkout-session",
      limit: 20,
      windowSeconds: 60
    });
    if (!limited.allowed) return apiRateLimited();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Login with Steam is required before checkout." },
        { status: 401 }
      );
    }

    const idempotencyKey = request.headers.get("Idempotency-Key");

    if (!idempotencyKey) {
      return NextResponse.json(
        { error: "Idempotency-Key header is required." },
        { status: 400 }
      );
    }

    const body = checkoutSessionSchema.parse(await request.json());
    const response = await runWithIdempotency({
      key: idempotencyKey,
      scope: IdempotencyScope.CHECKOUT_SESSION,
      request: { userId: user.id, ...body },
      handler: async () =>
        createCheckoutSession({
          orderId: body.orderId,
          userId: user.id,
          locale: body.locale,
          returnUrl: body.returnUrl
        })
    });

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
    }

    return errorResponse(error);
  }
}
