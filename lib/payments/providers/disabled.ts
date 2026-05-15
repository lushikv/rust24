import "server-only";

import { PaymentProvider } from "@prisma/client";
import { PaymentError } from "@/lib/payments/payment-errors";
import type { PaymentProviderAdapter } from "@/lib/payments/types";

export const disabledPaymentProvider: PaymentProviderAdapter = {
  provider: PaymentProvider.DISABLED,
  async createCheckoutSession() {
    throw new PaymentError("Payments are not enabled yet.", 503, "PAYMENT_PROVIDER_DISABLED");
  },
  async verifyWebhook() {
    return {
      valid: false,
      errorMessage: "Payments are not enabled yet."
    };
  }
};
