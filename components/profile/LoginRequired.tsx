import Link from "next/link";
import type { Locale } from "@/config/locales";

export function LoginRequired({ locale }: { locale: Locale }) {
  return (
    <section className="surface-card w-full p-6 sm:p-8">
      <h1 className="page-title">
        {locale === "ru" ? "Профиль закрыт" : "Profile is private"}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
        {locale === "ru"
          ? "Войдите через Steam, чтобы открыть профиль RUST24. Приватные страницы не индексируются поисковыми системами."
          : "Login with Steam to open your RUST24 profile. Private pages are hidden from search indexing."}
      </p>
      <Link
        href={`/api/auth/steam?locale=${locale}&returnTo=/${locale}/profile`}
        className="primary-cta mt-6"
      >
        {locale === "ru" ? "Войти через Steam" : "Login with Steam"}
      </Link>
    </section>
  );
}
