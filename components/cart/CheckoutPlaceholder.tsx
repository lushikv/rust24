"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/config/locales";
import type { CartDto } from "@/lib/cart/types";
import { formatCurrency } from "@/lib/localized";

type DraftOrder = {
  id: string;
  status: string;
};

type CheckoutSession = {
  paymentId: string;
  orderId: string;
  status: string;
  checkoutUrl: string | null;
  provider: string;
};

export function CheckoutPlaceholder({
  cart,
  locale
}: {
  cart: CartDto;
  locale: Locale;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [order, setOrder] = useState<DraftOrder | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null);

  function createDraftOrder() {
    startTransition(async () => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale })
      });
      const data = (await response.json()) as {
        order?: DraftOrder;
        error?: string;
      };

      if (!response.ok) {
        setMessage(data.error ?? (locale === "ru" ? "Заказ не создан." : "Order was not created."));
        return;
      }

      setMessage(
        locale === "ru"
          ? `Черновик заказа создан: ${data.order?.id}. Теперь можно запросить checkout session.`
          : `Draft order created: ${data.order?.id}. You can now request a checkout session.`
      );
      setOrder(data.order ?? null);
    });
  }

  function createCheckoutSession() {
    if (!order) {
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/payments/checkout-session", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Idempotency-Key": crypto.randomUUID()
        },
        body: JSON.stringify({
          orderId: order.id,
          locale,
          returnUrl: `/${locale}/checkout`
        })
      });
      const data = (await response.json()) as CheckoutSession & {
        error?: string;
      };

      if (!response.ok) {
        setMessage(data.error ?? (locale === "ru" ? "Checkout session не создана." : "Checkout session was not created."));
        return;
      }

      setCheckoutSession(data);
      setMessage(
        data.provider === "MOCK"
          ? locale === "ru"
            ? "Mock checkout session создана. Это dev-only поток без успешной оплаты."
            : "Mock checkout session created. This is a dev-only flow without successful payment."
          : locale === "ru"
            ? "Checkout session создана."
            : "Checkout session created."
      );
    });
  }

  return (
    <section className="surface-card p-6 sm:p-8">
      <h1 className="page-title">Checkout</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
        {locale === "ru"
          ? "Это безопасная заготовка checkout без платежного провайдера."
          : "This is a safe checkout placeholder without a payment provider."}
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="metal-panel p-4">
          <dt className="text-sm text-zinc-500">{locale === "ru" ? "Товаров" : "Items"}</dt>
          <dd className="mt-1 text-2xl font-black text-white">{cart.summary.totalQuantity}</dd>
        </div>
        <div className="metal-panel p-4">
          <dt className="text-sm text-zinc-500">{locale === "ru" ? "Подытог" : "Subtotal"}</dt>
          <dd className="mt-1 text-2xl font-black text-orange-300">
            {formatCurrency(cart.summary.subtotalRub, "RUB", locale)}
          </dd>
        </div>
      </dl>
      <button
        className="primary-cta mt-6 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || cart.items.length === 0 || Boolean(order)}
        type="button"
        onClick={createDraftOrder}
      >
        {locale === "ru" ? "Создать черновик заказа" : "Create draft order"}
      </button>
      {order ? (
        <button
          className="secondary-cta ml-0 mt-3 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-3"
          disabled={isPending || Boolean(checkoutSession)}
          type="button"
          onClick={createCheckoutSession}
        >
          {locale === "ru" ? "Создать checkout session" : "Create checkout session"}
        </button>
      ) : null}
      {message ? (
        <p className="mt-4 rounded-md border border-orange-500/20 bg-orange-500/10 p-3 text-sm text-orange-100">
          {message}
        </p>
      ) : null}
      {checkoutSession ? (
        <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
          <p>
            {locale === "ru" ? "Payment ID" : "Payment ID"}:{" "}
            <span className="font-bold text-white">{checkoutSession.paymentId}</span>
          </p>
          <p className="mt-1">
            {locale === "ru" ? "Статус" : "Status"}:{" "}
            <span className="font-bold text-white">{checkoutSession.status}</span>
          </p>
          {checkoutSession.checkoutUrl ? (
            <a
              className="mt-3 inline-flex rounded-md border border-orange-500/50 px-4 py-2 font-bold text-orange-200 transition hover:border-orange-300 hover:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
              href={checkoutSession.checkoutUrl}
            >
              {locale === "ru" ? "Открыть mock checkout" : "Open mock checkout"}
            </a>
          ) : null}
        </div>
      ) : null}
      <p className="mt-4 text-sm leading-6 text-zinc-400">
        {locale === "ru"
          ? "Интеграция оплаты, webhooks и выдача товаров будут добавлены на отдельном этапе."
          : "Payment integration, webhooks, and product delivery will be added in a separate stage."}
      </p>
    </section>
  );
}
