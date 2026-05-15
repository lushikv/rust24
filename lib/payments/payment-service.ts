import "server-only";

import {
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma,
  WebhookEventStatus
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSafeReturnPath } from "@/lib/auth/redirects";
import type { Locale } from "@/config/locales";
import { PaymentError, toPaymentError } from "@/lib/payments/payment-errors";
import { getPaymentProvider } from "@/lib/payments/providers";
import { assertPaymentTransition, getOrderStatusForCheckoutPending } from "@/lib/payments/payment-state";

const activePaymentStatuses = [
  PaymentStatus.CREATED,
  PaymentStatus.CHECKOUT_PENDING,
  PaymentStatus.AUTHORIZATION_PENDING
];

type CheckoutResponse = {
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  checkoutUrl: string | null;
  provider: PaymentProvider;
};

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function recordPaymentAttempt({
  paymentId,
  provider,
  status,
  requestPayload,
  responsePayload,
  errorMessage
}: {
  paymentId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  requestPayload?: unknown;
  responsePayload?: unknown;
  errorMessage?: string;
}) {
  await prisma.paymentAttempt.create({
    data: {
      paymentId,
      provider,
      status,
      requestPayload: requestPayload ? toJson(requestPayload) : undefined,
      responsePayload: responsePayload ? toJson(responsePayload) : undefined,
      errorMessage
    }
  });
}

export async function transitionPaymentStatus(paymentId: string, nextStatus: PaymentStatus) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) {
    throw new PaymentError("Payment was not found.", 404, "PAYMENT_NOT_FOUND");
  }

  assertPaymentTransition(payment.status, nextStatus);

  return prisma.payment.update({
    where: { id: paymentId },
    data: { status: nextStatus }
  });
}

export async function transitionOrderForCheckoutPending(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: getOrderStatusForCheckoutPending() }
  });
}

export async function createCheckoutSession({
  orderId,
  userId,
  locale,
  returnUrl
}: {
  orderId: string;
  userId: string;
  locale: Locale;
  returnUrl?: string | null;
}): Promise<CheckoutResponse> {
  try {
    const provider = getPaymentProvider();
    const safeReturnUrl = getSafeReturnPath(returnUrl ?? `/${locale}/checkout`, locale);
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        payments: {
          where: { status: { in: activePaymentStatuses } },
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    if (!order) {
      throw new PaymentError("Order was not found.", 404, "ORDER_NOT_FOUND");
    }

    if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new PaymentError("Order is not available for checkout.", 409, "ORDER_NOT_CHECKOUTABLE");
    }

    if (order.totalRub <= 0) {
      throw new PaymentError("Order total must be greater than zero.", 400, "ORDER_TOTAL_INVALID");
    }

    let payment = order.payments[0];

    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: provider.provider,
          status: PaymentStatus.CREATED,
          currency: order.currency,
          amountRub: order.totalRub,
          amountEur: order.totalEur,
          expiresAt: new Date(Date.now() + 1000 * 60 * 30)
        }
      });
    }

    try {
      const result = await provider.createCheckoutSession({
        paymentId: payment.id,
        orderId: order.id,
        amountRub: payment.amountRub,
        amountEur: payment.amountEur,
        currency: payment.currency,
        locale,
        returnUrl: safeReturnUrl
      });

      assertPaymentTransition(payment.status, result.status);

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          provider: result.provider,
          providerPaymentId: result.providerPaymentId,
          checkoutUrl: result.checkoutUrl,
          status: result.status,
          metadata: result.rawResponse ? toJson(result.rawResponse) : undefined
        }
      });

      await transitionOrderForCheckoutPending(order.id);
      await recordPaymentAttempt({
        paymentId: payment.id,
        provider: result.provider,
        status: result.status,
        requestPayload: { orderId: order.id, returnUrl: safeReturnUrl },
        responsePayload: result.rawResponse
      });

      return {
        paymentId: updatedPayment.id,
        orderId: order.id,
        status: updatedPayment.status,
        checkoutUrl: updatedPayment.checkoutUrl,
        provider: updatedPayment.provider
      };
    } catch (error) {
      const paymentError = toPaymentError(error);

      await recordPaymentAttempt({
        paymentId: payment.id,
        provider: provider.provider,
        status: payment.status,
        requestPayload: { orderId: order.id, returnUrl: safeReturnUrl },
        errorMessage: paymentError.message
      }).catch(() => undefined);

      throw paymentError;
    }
  } catch (error) {
    throw toPaymentError(error);
  }
}

export async function getPaymentById(paymentId: string, userId: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        order: { userId }
      },
      include: {
        order: true
      }
    });

    if (!payment) {
      throw new PaymentError("Payment was not found.", 404, "PAYMENT_NOT_FOUND");
    }

    return {
      id: payment.id,
      orderId: payment.orderId,
      provider: payment.provider,
      status: payment.status,
      currency: payment.currency,
      amountRub: payment.amountRub,
      amountEur: payment.amountEur,
      checkoutUrl: payment.checkoutUrl,
      createdAt: payment.createdAt.toISOString(),
      expiresAt: payment.expiresAt?.toISOString() ?? null
    };
  } catch (error) {
    throw toPaymentError(error);
  }
}

export async function recordWebhookEvent({
  provider,
  providerEventId,
  status,
  signatureValid,
  payload,
  paymentId,
  errorMessage
}: {
  provider: PaymentProvider;
  providerEventId?: string;
  status: WebhookEventStatus;
  signatureValid: boolean;
  payload: unknown;
  paymentId?: string;
  errorMessage?: string;
}) {
  return prisma.paymentWebhookEvent.create({
    data: {
      provider,
      providerEventId,
      status,
      signatureValid,
      payload: toJson(payload),
      paymentId,
      processedAt: status === WebhookEventStatus.PROCESSED ? new Date() : undefined,
      errorMessage
    }
  });
}

export async function processMockWebhook({
  rawBody,
  signature
}: {
  rawBody: string;
  signature: string | null;
}) {
  try {
    const provider = getPaymentProvider();

    if (provider.provider !== PaymentProvider.MOCK) {
      throw new PaymentError("Mock payment provider is not enabled.", 503, "MOCK_PROVIDER_DISABLED");
    }

    const verification = await provider.verifyWebhook({ rawBody, signature });
    const payload = verification.payload ?? JSON.parse(rawBody) as Record<string, unknown>;

    if (!verification.valid || !verification.paymentId || !verification.status) {
      await recordWebhookEvent({
        provider: PaymentProvider.MOCK,
        providerEventId: verification.providerEventId,
        status: WebhookEventStatus.REJECTED,
        signatureValid: verification.valid,
        payload,
        errorMessage: verification.errorMessage
      });
      throw new PaymentError(verification.errorMessage ?? "Mock webhook was rejected.", 400, "WEBHOOK_REJECTED");
    }

    await transitionPaymentStatus(verification.paymentId, verification.status);
    await recordWebhookEvent({
      provider: PaymentProvider.MOCK,
      providerEventId: verification.providerEventId,
      status: WebhookEventStatus.PROCESSED,
      signatureValid: true,
      payload,
      paymentId: verification.paymentId
    });

    return { ok: true, status: verification.status };
  } catch (error) {
    throw toPaymentError(error);
  }
}
