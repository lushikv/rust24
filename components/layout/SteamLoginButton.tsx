import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function SteamLoginButton({ locale }: { locale: Locale }) {
  const t = await getTranslations("auth");
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <Link
          href={`/${locale}/profile`}
          className="focus-ring max-w-36 truncate rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-black text-white transition hover:border-orange-300/50 hover:text-orange-100 sm:max-w-44"
          title={user.displayName}
        >
          {user.displayName}
        </Link>
        <a
          href={`/api/auth/logout?locale=${locale}&returnTo=/${locale}`}
          className="focus-ring rounded-md border border-orange-500/50 px-3 py-2 text-xs font-black text-orange-200 transition hover:border-orange-300 hover:text-orange-100"
        >
          {t("logout")}
        </a>
      </div>
    );
  }

  return (
    <Link
      href={`/api/auth/steam?locale=${locale}&returnTo=/${locale}/profile`}
      className="focus-ring rounded-md border border-orange-300/50 bg-orange-500 px-3 py-2 text-xs font-black text-black shadow-lg shadow-orange-950/30 transition hover:bg-orange-300"
    >
      <span className="sm:hidden">Steam</span>
      <span className="hidden sm:inline">{t("steam")}</span>
    </Link>
  );
}
