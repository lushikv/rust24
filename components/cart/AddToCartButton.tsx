"use client";

import Link from "next/link";
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
      setMessage(locale === "ru" ? "Товар добавлен в корзину." : "Item added to cart.");
    });
  }

  return (
    <div className="mt-3 space-y-3">
      <button
        className="block w-full rounded-md border border-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:border-orange-300 hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="button"
        onClick={addToCart}
      >
        {isPending
          ? locale === "ru"
            ? "Добавляем..."
            : "Adding..."
          : locale === "ru"
            ? "Добавить в корзину"
            : "Add to cart"}
      </button>
      {message ? (
        <p
          className={
            state === "error"
              ? "text-xs leading-5 text-orange-200"
              : "text-xs leading-5 text-zinc-300"
          }
        >
          {message}
        </p>
      ) : null}
      {state === "added" ? (
        <Link
          className="block rounded-md bg-orange-500 px-4 py-3 text-center text-sm font-black text-black transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
          href={`/${locale}/cart`}
        >
          {locale === "ru" ? "Открыть корзину" : "Open cart"}
        </Link>
      ) : null}
    </div>
  );
}
