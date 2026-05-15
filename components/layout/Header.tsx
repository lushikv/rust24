import Link from "next/link";
import Image from "next/image";
import { CurrencySwitcher } from "@/components/layout/CurrencySwitcher";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MainNav } from "@/components/layout/MainNav";
import { SteamLoginButton } from "@/components/layout/SteamLoginButton";
import type { Locale } from "@/config/locales";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-orange-200/10 bg-[#07080b]/78 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="focus-ring group flex items-center gap-3 rounded-md text-xl font-black tracking-wide text-white"
            aria-label="RUST24 home"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-orange-300/35 bg-black/45 p-1 shadow-lg shadow-orange-950/30 transition group-hover:border-orange-300/60 group-hover:shadow-orange-500/20">
              <Image
                src="/images/brand/rust24-mark.svg"
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className="h-full w-full"
              />
            </span>
            <span>
              <span className="text-orange-400">RUST</span>24
            </span>
          </Link>
          <div className="flex min-w-0 items-center gap-2">
            <LanguageSwitcher locale={locale} />
            <CurrencySwitcher />
            <Link
              href={`/${locale}/cart`}
              className="focus-ring rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-black text-white transition hover:border-orange-300/50 hover:text-orange-100"
            >
              {locale === "ru" ? "Корзина" : "Cart"}
            </Link>
            <SteamLoginButton locale={locale} />
          </div>
        </div>
        <MainNav locale={locale} />
      </div>
    </header>
  );
}
