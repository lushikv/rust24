import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiRateLimited } from "@/lib/api/responses";
import { PaymentError, toPaymentError } from "@/lib/payments/payment-errors";
import { processMockWebhook } from "@/lib/payments/payment-service";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

const mockWebhookSchema = z.object({
  paymentId: z.string().min(1),
  status: z.enum(["CANCELLED", "EXPIRED", "FAILED"]),
  eventId: z.string().optional()
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
    const limited = await checkRequestRateLimit({
      request,
      keyPrefix: "mock-webhook",
      limit: 60,
      windowSeconds: 60
    });
    if (!limited.allowed) return apiRateLimited();

    const rawBody = await request.text();
    mockWebhookSchema.parse(JSON.parse(rawBody));
    const result = await processMockWebhook({
      rawBody,
      signature: request.headers.get("x-rust24-signature")
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid mock webhook payload." }, { status: 400 });
    }

    return errorResponse(error);
  }
}
