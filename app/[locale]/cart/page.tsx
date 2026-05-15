import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import type { Locale } from "@/config/locales";
import { getCurrentUser } from "@/lib/auth/current-user";
import { readCartSessionId } from "@/lib/cart/cart-cookie";
import { getCart } from "@/lib/cart/cart-service";
import { createNoIndexMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createNoIndexMetadata({
    locale,
    path: "/cart",
    title: locale === "ru" ? "Корзина RUST24" : "RUST24 Cart",
    description:
      locale === "ru"
        ? "Приватная корзина RUST24 без индексации."
        : "Private RUST24 cart page without indexing."
  });
}

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;
  const [user, sessionId] = await Promise.all([
    getCurrentUser(),
    readCartSessionId()
  ]);
  const cart = await getCart({
    userId: user?.id,
    sessionId,
    locale
  });

  return (
    <div className="w-full space-y-8">
      <PageHero
        title={locale === "ru" ? "Корзина" : "Cart"}
        description={
          locale === "ru"
            ? "Корзина хранит подготовленные товары. Реальная оплата и выдача появятся позже."
            : "The cart stores prepared items. Real payment and delivery will be added later."
        }
        accent="PRIVATE CART"
      />
      <CartView initialCart={cart} locale={locale} authenticated={Boolean(user)} />
    </div>
  );
}
