import Link from "next/link";
import type { Locale } from "@/config/locales";

export function EmptyCart({ locale, unavailable }: { locale: Locale; unavailable?: boolean }) {
  return (
    <section className="surface-card p-6">
      <h2 className="text-2xl font-black text-white">
        {unavailable
          ? locale === "ru"
            ? "Корзина временно недоступна"
            : "Cart is temporarily unavailable"
          : locale === "ru"
            ? "Корзина пуста"
            : "Cart is empty"}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        {unavailable
          ? locale === "ru"
            ? "Для чтения корзины нужна база данных. Публичные страницы продолжают работать без нее."
            : "Cart reads need the database. Public pages continue to work without it."
          : locale === "ru"
            ? "Добавьте товар из магазина, чтобы подготовить будущий заказ."
            : "Add a store item to prepare a future order."}
      </p>
      <Link
        className="primary-cta mt-5"
        href={`/${locale}/store`}
      >
        {locale === "ru" ? "Перейти в магазин" : "Open store"}
      </Link>
    </section>
  );
}
