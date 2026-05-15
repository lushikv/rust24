import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { PaymentProvider, PaymentStatus } from "@prisma/client";
import type {
  CheckoutSessionInput,
  PaymentProviderAdapter,
  WebhookVerificationInput
} from "@/lib/payments/types";

function getMockSecret() {
  return process.env.MOCK_PAYMENT_WEBHOOK_SECRET ?? "";
}

function signBody(rawBody: string) {
  return createHmac("sha256", getMockSecret()).update(rawBody).digest("hex");
}

function isValidSignature(rawBody: string, signature: string | null) {
  const secret = getMockSecret();

  if (!secret || !signature) {
    return false;
  }

  const expected = signBody(rawBody);
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(signature, "hex");

  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  );
}

function parseMockStatus(value: unknown) {
  if (value === "CANCELLED" || value === "EXPIRED" || value === "FAILED") {
    return value;
  }

  return undefined;
}

export const mockPaymentProvider: PaymentProviderAdapter = {
  provider: PaymentProvider.MOCK,
  async createCheckoutSession(input: CheckoutSessionInput) {
    return {
      provider: PaymentProvider.MOCK,
      providerPaymentId: `mock_${input.paymentId}`,
      status: PaymentStatus.CHECKOUT_PENDING,
      checkoutUrl: `/${input.locale}/checkout/mock?paymentId=${input.paymentId}`,
      rawResponse: {
        devOnly: true,
        orderId: input.orderId
      }
    };
  },
  async verifyWebhook(input: WebhookVerificationInput) {
    const valid = isValidSignature(input.rawBody, input.signature);

    if (!valid) {
      return {
        valid: false,
        errorMessage: "Invalid mock webhook signature."
      };
    }

    const payload = JSON.parse(input.rawBody) as {
      eventId?: unknown;
      paymentId?: unknown;
      status?: unknown;
    };
    const status = parseMockStatus(payload.status);

    return {
      valid: Boolean(status && typeof payload.paymentId === "string"),
      providerEventId: typeof payload.eventId === "string" ? payload.eventId : undefined,
      paymentId: typeof payload.paymentId === "string" ? payload.paymentId : undefined,
      status,
      payload: payload as Record<string, unknown>,
      errorMessage: status ? undefined : "Mock webhook status must be CANCELLED, EXPIRED, or FAILED."
    };
  }
};

export function verifyMockWebhookSignature(rawBody: string, signature: string | null) {
  return isValidSignature(rawBody, signature);
}
