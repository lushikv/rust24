import type { Metadata } from "next";
import { CheckoutPlaceholder } from "@/components/cart/CheckoutPlaceholder";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { LoginRequired } from "@/components/profile/LoginRequired";
import type { Locale } from "@/config/locales";
import { getCurrentUser } from "@/lib/auth/current-user";
import { readCartSessionId } from "@/lib/cart/cart-cookie";
import { getCart } from "@/lib/cart/cart-service";
import { createNoIndexMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createNoIndexMetadata({
    locale,
    path: "/checkout",
    title: locale === "ru" ? "Checkout RUST24" : "RUST24 Checkout",
    description:
      locale === "ru"
        ? "Приватная checkout-страница RUST24 без индексации."
        : "Private RUST24 checkout page without indexing."
  });
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale } = await params;
  const [user, sessionId] = await Promise.all([
    getCurrentUser(),
    readCartSessionId()
  ]);

  if (!user) {
    return <LoginRequired locale={locale} />;
  }

  const cart = await getCart({
    userId: user.id,
    sessionId,
    locale
  });

  if (cart.items.length === 0 || cart.unavailable) {
    return <EmptyCart locale={locale} unavailable={cart.unavailable} />;
  }

  return <CheckoutPlaceholder cart={cart} locale={locale} />;
}
