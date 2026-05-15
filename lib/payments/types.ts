import "server-only";

import type { CurrencyCode, PaymentProvider, PaymentStatus } from "@prisma/client";
import type { Locale } from "@/config/locales";

export type PaymentProviderName = PaymentProvider;

export type CheckoutSessionInput = {
  paymentId: string;
  orderId: string;
  amountRub: number;
  amountEur: number | null;
  currency: CurrencyCode;
  locale: Locale;
  returnUrl: string;
};

export type CheckoutSessionResult = {
  provider: PaymentProviderName;
  providerPaymentId?: string;
  status: PaymentStatus;
  checkoutUrl?: string;
  rawResponse?: Record<string, unknown>;
};

export type WebhookVerificationInput = {
  rawBody: string;
  signature: string | null;
};

export type WebhookVerificationResult = {
  valid: boolean;
  providerEventId?: string;
  paymentId?: string;
  status?: Extract<PaymentStatus, "CANCELLED" | "EXPIRED" | "FAILED">;
  payload?: Record<string, unknown>;
  errorMessage?: string;
};

export type PaymentStateTransition = {
  from: PaymentStatus;
  to: PaymentStatus;
};

export interface PaymentProviderAdapter {
  provider: PaymentProviderName;
  createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSessionResult>;
  verifyWebhook(input: WebhookVerificationInput): Promise<WebhookVerificationResult>;
}
