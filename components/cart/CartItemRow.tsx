"use client";

import Link from "next/link";
import type { Locale } from "@/config/locales";
import type { CartLineItem } from "@/lib/cart/types";
import { formatCurrency } from "@/lib/localized";

export function CartItemRow({
  item,
  locale,
  disabled,
  onQuantityChange,
  onRemove
}: {
  item: CartLineItem;
  locale: Locale;
  disabled: boolean;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}) {
  return (
    <article className="surface-card p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-white">
            <Link
              className="focus-ring rounded-sm transition hover:text-orange-200"
              href={`/${locale}/store/${item.categorySlug}/${item.productSlug}`}
            >
              {item.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {formatCurrency(item.unitPriceRub, "RUB", locale)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-bold text-zinc-300">
            {locale === "ru" ? "Кол-во" : "Qty"}
            <input
              className="ml-2 w-20 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              disabled={disabled}
              min={1}
              max={99}
              type="number"
              value={item.quantity}
              onChange={(event) => onQuantityChange(item.id, Number(event.target.value))}
            />
          </label>
          <p className="min-w-24 text-right font-black text-orange-300">
            {formatCurrency(item.totalRub, "RUB", locale)}
          </p>
          <button
            className="secondary-cta px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            type="button"
            onClick={() => onRemove(item.id)}
          >
            {locale === "ru" ? "Удалить" : "Remove"}
          </button>
        </div>
      </div>
    </article>
  );
}
