import { PaymentProvider, PaymentStatus } from "@prisma/client";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashRequest } from "@/lib/payments/idempotency-hash";
import { PaymentError } from "@/lib/payments/payment-errors";
import { assertPaymentTransition } from "@/lib/payments/payment-state";
import { disabledPaymentProvider } from "@/lib/payments/providers/disabled";
import { mockPaymentProvider } from "@/lib/payments/providers/mock";

describe("payment hardening", () => {
  it("hashes idempotency requests deterministically", () => {
    assert.equal(hashRequest({ orderId: "order_1", locale: "ru" }), hashRequest({ orderId: "order_1", locale: "ru" }));
    assert.notEqual(hashRequest({ orderId: "order_1" }), hashRequest({ orderId: "order_2" }));
  });

  it("rejects invalid payment state transitions", () => {
    assert.doesNotThrow(() => assertPaymentTransition(PaymentStatus.CREATED, PaymentStatus.CHECKOUT_PENDING));
    assert.throws(() => assertPaymentTransition(PaymentStatus.FAILED, PaymentStatus.CHECKOUT_PENDING), PaymentError);
  });

  it("keeps the disabled provider unavailable", async () => {
    await assert.rejects(disabledPaymentProvider.createCheckoutSession({
      paymentId: "payment_1",
      orderId: "order_1",
      amountRub: 100,
      amountEur: null,
      currency: "RUB",
      locale: "ru",
      returnUrl: "/ru/checkout"
    }), { code: "PAYMENT_PROVIDER_DISABLED" });
  });

  it("mock provider never returns a successful status", async () => {
    const session = await mockPaymentProvider.createCheckoutSession({
      paymentId: "payment_1",
      orderId: "order_1",
      amountRub: 100,
      amountEur: null,
      currency: "RUB",
      locale: "ru",
      returnUrl: "/ru/checkout"
    });

    assert.equal(session.provider, PaymentProvider.MOCK);
    assert.equal(session.status, PaymentStatus.CHECKOUT_PENDING);
    assert.notEqual(session.status, "SUCCEEDED");
  });
});
