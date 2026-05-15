import "server-only";

import { OrderStatus, PaymentStatus } from "@prisma/client";
import { PaymentError } from "@/lib/payments/payment-errors";

const allowedPaymentTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  CREATED: [
    PaymentStatus.CHECKOUT_PENDING,
    PaymentStatus.AUTHORIZATION_PENDING,
    PaymentStatus.CANCELLED,
    PaymentStatus.EXPIRED,
    PaymentStatus.FAILED
  ],
  CHECKOUT_PENDING: [
    PaymentStatus.AUTHORIZATION_PENDING,
    PaymentStatus.CANCELLED,
    PaymentStatus.EXPIRED,
    PaymentStatus.FAILED
  ],
  AUTHORIZATION_PENDING: [
    PaymentStatus.CANCELLED,
    PaymentStatus.EXPIRED,
    PaymentStatus.FAILED
  ],
  CANCELLED: [],
  EXPIRED: [],
  FAILED: []
};

export function assertPaymentTransition(from: PaymentStatus, to: PaymentStatus) {
  if (from === to) {
    return;
  }

  if (!allowedPaymentTransitions[from].includes(to)) {
    throw new PaymentError(`Invalid payment transition from ${from} to ${to}.`, 409, "INVALID_PAYMENT_TRANSITION");
  }
}

export function getOrderStatusForCheckoutPending() {
  return OrderStatus.PENDING_PAYMENT;
}
