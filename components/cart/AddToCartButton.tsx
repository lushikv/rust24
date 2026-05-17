"use client";

import { useState, useTransition } from "react";
import type { Locale, StoreProductDetail } from "@/types/content";

export function AddToCartButton({
  product,
  locale
}: {
  product: StoreProductDetail;
  locale: Locale;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "added" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function addToCart() {
    startTransition(async () => {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          categorySlug: product.categorySlug,
          productSlug: product.slug,
          quantity: 1,
          currency: "RUB",
          locale
        })
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? (locale === "ru" ? "Не удалось добавить товар." : "Could not add item."));
        return;
      }

      setState("added");
      setMessage(locale === "ru" ? "Товар уже в корзине." : "Item is in your cart.");
    });
  }

  const buttonLabel = isPending
    ? locale === "ru"
      ? "Добавляем..."
      : "Adding..."
    : state === "added"
      ? locale === "ru"
        ? "Добавлено в корзину"
        : "Added to cart"
      : locale === "ru"
        ? "Добавить в корзину"
        : "Add to cart";

  return (
    <div className="mt-3 space-y-2">
      <button
        className="primary-cta w-full disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || state === "added"}
        type="button"
        onClick={addToCart}
      >
        {buttonLabel}
      </button>
      <p
        className={
          state === "error"
            ? "min-h-5 text-xs leading-5 text-orange-200"
            : message
              ? "min-h-5 text-xs leading-5 text-zinc-300"
              : "min-h-5 text-xs leading-5 text-transparent"
        }
      >
        {message ?? "."}
      </p>
    </div>
  );
}
