import Link from "next/link";
import type { Metadata } from "next";
import { LoginRequired } from "@/components/profile/LoginRequired";
import { PageHero } from "@/components/ui/PageHero";
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
    path: "/profile/settings",
    title: locale === "ru" ? "Настройки профиля RUST24" : "RUST24 Profile Settings",
    description:
      locale === "ru"
        ? "Приватная страница настроек игрока RUST24."
        : "Private RUST24 player settings page."
  });
}

export default async function ProfileSettingsPage({ params }: PageProps) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return <LoginRequired locale={locale} />;
  }

  return (
    <div className="w-full space-y-6">
      <PageHero
        accent={locale === "ru" ? "Аккаунт" : "Account"}
        title={locale === "ru" ? "Настройки" : "Settings"}
        description={
          locale === "ru"
            ? "Здесь будет управление локалью, валютой и приватными предпочтениями профиля."
            : "Locale, currency, and private profile preferences will be managed here."
        }
      >
        <Link className="secondary-cta" href={`/${locale}/profile`}>
          {locale === "ru" ? "Назад в профиль" : "Back to profile"}
        </Link>
      </PageHero>
      <div className="grid gap-4 sm:grid-cols-2">
        <SurfaceCard className="p-5">
          <h2 className="text-lg font-black text-white">
            {locale === "ru" ? "Локаль" : "Locale"}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {locale === "ru"
              ? `Текущее значение: ${user.locale}. Изменение будет добавлено позже.`
              : `Current value: ${user.locale}. Editing will be added later.`}
          </p>
        </SurfaceCard>
        <SurfaceCard className="p-5">
          <h2 className="text-lg font-black text-white">
            {locale === "ru" ? "Валюта" : "Currency"}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {locale === "ru"
              ? `Текущее значение: ${user.currency}. Изменение будет добавлено позже.`
              : `Current value: ${user.currency}. Editing will be added later.`}
          </p>
        </SurfaceCard>
      </div>
    </div>
  );
}
