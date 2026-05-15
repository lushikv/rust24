import Link from "next/link";
import type { Metadata } from "next";
import { LoginRequired } from "@/components/profile/LoginRequired";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/ui/PageHero";
import { StatCard } from "@/components/ui/StatCard";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { Locale } from "@/config/locales";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createNoIndexMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createNoIndexMetadata({
    locale,
    path: "/profile",
    title: locale === "ru" ? "Профиль RUST24" : "RUST24 Profile",
    description:
      locale === "ru"
        ? "Приватный профиль игрока RUST24."
        : "Private RUST24 player profile."
  });
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return <LoginRequired locale={locale} />;
  }

  return (
    <div className="w-full space-y-8">
      <PageHero
        accent={locale === "ru" ? "Steam профиль" : "Steam profile"}
        title={user.displayName}
        description={
          locale === "ru"
            ? "Приватная зона игрока RUST24: профиль, заказы и будущие настройки аккаунта."
            : "Your private RUST24 player area for profile details, orders, and future account settings."
        }
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {user.avatarUrl ? (
            <div
              aria-label={locale === "ru" ? "Аватар Steam" : "Steam avatar"}
              className="h-20 w-20 rounded-md border border-orange-300/30 object-cover shadow-[0_0_28px_rgba(251,146,60,0.2)]"
              role="img"
              style={{
                backgroundImage: `url(${user.avatarUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
              }}
            />
          ) : null}
          <div className="space-y-2">
            <Badge variant="muted">SteamID: {user.steamId}</Badge>
            <p className="text-sm text-zinc-400">
              {locale === "ru"
                ? "Реальные покупки и выдача товаров появятся после следующих backend-этапов."
                : "Real purchases and delivery will appear after the next backend stages."}
            </p>
          </div>
        </div>
      </PageHero>
      <dl className="grid gap-4 text-sm sm:grid-cols-3">
        <StatCard label={locale === "ru" ? "Роль" : "Role"} value={user.role} />
        <StatCard label={locale === "ru" ? "Локаль" : "Locale"} value={user.locale} />
        <StatCard label={locale === "ru" ? "Валюта" : "Currency"} value={user.currency} />
      </dl>
      <section className="grid gap-4 md:grid-cols-3">
        <SurfaceCard
          as={Link}
          interactive
          className="p-5 focus-ring"
          href={`/${locale}/profile/orders`}
        >
          <h2 className="text-xl font-black text-white">
            {locale === "ru" ? "Заказы" : "Orders"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {locale === "ru"
              ? "История покупок появится после этапов checkout и платежей."
              : "Purchase history will appear after checkout and payment stages."}
          </p>
        </SurfaceCard>
        <SurfaceCard
          as={Link}
          interactive
          className="p-5 focus-ring"
          href={`/${locale}/profile/settings`}
        >
          <h2 className="text-xl font-black text-white">
            {locale === "ru" ? "Настройки" : "Settings"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {locale === "ru"
              ? "Заготовка будущих предпочтений локали и валюты."
              : "Placeholder for future locale and currency preferences."}
          </p>
        </SurfaceCard>
        <SurfaceCard
          as="a"
          interactive
          className="border-orange-500/30 bg-orange-500/10 p-5 focus-ring"
          href={`/api/auth/logout?locale=${locale}&returnTo=/${locale}`}
        >
          <h2 className="text-xl font-black text-white">
            {locale === "ru" ? "Выйти" : "Logout"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-orange-100">
            {locale === "ru" ? "Очистить текущую сессию." : "Clear the current session."}
          </p>
        </SurfaceCard>
      </section>
    </div>
  );
}
