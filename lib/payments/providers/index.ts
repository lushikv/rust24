import "server-only";

import { disabledPaymentProvider } from "@/lib/payments/providers/disabled";
import { mockPaymentProvider } from "@/lib/payments/providers/mock";
import type { PaymentProviderAdapter } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProviderAdapter {
  const provider = (process.env.PAYMENT_PROVIDER ?? "disabled").toLowerCase();

  if (provider === "mock") {
    return mockPaymentProvider;
  }

  return disabledPaymentProvider;
}
