import Link from "next/link";
import type { Locale } from "@/config/locales";
import type { CartDto } from "@/lib/cart/types";
import { formatCurrency } from "@/lib/localized";

export function CartSummary({
  cart,
  locale
}: {
  cart: CartDto;
  locale: Locale;
}) {
  return (
    <aside className="surface-card p-5 lg:sticky lg:top-32">
      <h2 className="text-xl font-black text-white">
        {locale === "ru" ? "Итого" : "Summary"}
      </h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{locale === "ru" ? "Товаров" : "Items"}</dt>
          <dd className="font-bold text-white">{cart.summary.totalQuantity}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{locale === "ru" ? "Подытог" : "Subtotal"}</dt>
          <dd className="font-black text-orange-300">
            {formatCurrency(cart.summary.subtotalRub, "RUB", locale)}
          </dd>
        </div>
      </dl>
      <Link
        href={`/${locale}/checkout`}
        className="primary-cta mt-6 w-full"
      >
        {locale === "ru" ? "Перейти к checkout" : "Continue to checkout"}
      </Link>
      <p className="mt-4 text-xs leading-5 text-zinc-500">
        {locale === "ru"
          ? "Оплата и выдача товаров пока не подключены."
          : "Payments and product delivery are not connected yet."}
      </p>
    </aside>
  );
}
