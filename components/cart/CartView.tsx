"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/config/locales";
import type { CartDto } from "@/lib/cart/types";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

export function CartView({
  initialCart,
  locale,
  authenticated
}: {
  initialCart: CartDto;
  locale: Locale;
  authenticated: boolean;
}) {
  const [cart, setCart] = useState(initialCart);
  const [message, setMessage] = useState<string | null>(initialCart.message ?? null);
  const [isPending, startTransition] = useTransition();

  async function refreshFromResponse(response: Response) {
    const data = (await response.json()) as {
      cart?: CartDto;
      error?: string;
    };

    if (!response.ok) {
      setMessage(data.error ?? (locale === "ru" ? "Действие не выполнено." : "Action failed."));
      return;
    }

    if (data.cart) {
      setCart(data.cart);
    }

    setMessage(null);
  }

  function updateQuantity(itemId: string, quantity: number) {
    startTransition(async () => {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity, locale })
      });
      await refreshFromResponse(response);
    });
  }

  function removeItem(itemId: string) {
    startTransition(async () => {
      const response = await fetch(`/api/cart/items/${itemId}?locale=${locale}`, {
        method: "DELETE"
      });
      await refreshFromResponse(response);
    });
  }

  function clearCurrentCart() {
    startTransition(async () => {
      const response = await fetch("/api/cart", { method: "DELETE" });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setMessage(data.error ?? (locale === "ru" ? "Корзина не очищена." : "Cart was not cleared."));
        return;
      }

      setCart({
        ...cart,
        items: [],
        summary: {
          totalQuantity: 0,
          subtotalRub: 0,
          subtotalEur: 0
        }
      });
      setMessage(null);
    });
  }

  if (cart.items.length === 0) {
    return <EmptyCart locale={locale} unavailable={cart.unavailable} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        {message ? (
          <p className="rounded-md border border-orange-500/20 bg-orange-500/10 p-3 text-sm text-orange-100">
            {message}
          </p>
        ) : null}
        {!authenticated ? (
          <p className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-zinc-300">
            {locale === "ru"
              ? "Гостевая корзина доступна, но checkout потребует вход через Steam."
              : "Guest cart is available, but checkout will require Steam login."}
          </p>
        ) : null}
        {cart.items.map((item) => (
          <CartItemRow
            key={item.id}
            disabled={isPending}
            item={item}
            locale={locale}
            onQuantityChange={updateQuantity}
            onRemove={removeItem}
          />
        ))}
        <button
          className="rounded-md border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-orange-300 hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="button"
          onClick={clearCurrentCart}
        >
          {locale === "ru" ? "Очистить корзину" : "Clear cart"}
        </button>
      </div>
      <CartSummary cart={cart} locale={locale} />
    </div>
  );
}
