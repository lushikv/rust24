import Link from "next/link";
import type { Metadata } from "next";
import { LoginRequired } from "@/components/profile/LoginRequired";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/ui/PageHero";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { Locale } from "@/config/locales";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getProfileOrders } from "@/lib/cart/order-service";
import { formatCurrency } from "@/lib/localized";
import { createNoIndexMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createNoIndexMetadata({
    locale,
    path: "/profile/orders",
    title: locale === "ru" ? "Заказы профиля RUST24" : "RUST24 Profile Orders",
    description:
      locale === "ru"
        ? "Приватная страница заказов игрока RUST24."
        : "Private RUST24 player orders page."
  });
}

export default async function ProfileOrdersPage({ params }: PageProps) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return <LoginRequired locale={locale} />;
  }

  const orders = await getProfileOrders(user.id);

  return (
    <div className="w-full space-y-6">
      <PageHero
        accent={locale === "ru" ? "Приватная зона" : "Private area"}
        title={locale === "ru" ? "Заказы" : "Orders"}
        description={
          locale === "ru"
            ? "Черновики и ожидающие оплату заказы будут отображаться здесь. Фейковых оплаченных заказов нет."
            : "Draft and pending-payment orders will appear here. No fake paid orders are shown."
        }
      >
        <Link className="secondary-cta" href={`/${locale}/profile`}>
          {locale === "ru" ? "Назад в профиль" : "Back to profile"}
        </Link>
      </PageHero>
      {orders.length === 0 ? (
        <SurfaceCard className="p-6 text-lg leading-8 text-zinc-300">
          {locale === "ru"
            ? "История заказов пока пуста. Реальные покупки появятся здесь после этапов корзины, checkout и платежей."
            : "Order history is empty for now. Real purchases will appear here after cart, checkout, and payment stages."}
        </SurfaceCard>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <SurfaceCard as="article" className="p-4" key={order.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-black text-white">{order.id}</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString(locale)}
                  </p>
                </div>
                <div className="text-sm sm:text-right">
                  <Badge variant="muted">{order.status}</Badge>
                  <p className="font-black text-orange-300">
                    {formatCurrency(order.totalRub, "RUB", locale)}
                  </p>
                  <p className="mt-1 text-zinc-400">
                    {order.itemCount} {locale === "ru" ? "тов." : "items"}
                  </p>
                  {order.paymentStatus ? (
                    <p className="mt-1 text-zinc-500">
                      {order.paymentProvider}: {order.paymentStatus}
                    </p>
                  ) : null}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      )}
    </div>
  );
}
