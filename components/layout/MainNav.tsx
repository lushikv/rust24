"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Locale } from "@/config/locales";
import { cn } from "@/lib/utils";

type MainNavProps = {
  locale: Locale;
};

const primaryItems = [
  { key: "store", href: "/store", icon: "store" },
  { key: "servers", href: "/servers", icon: "servers" },
  { key: "support", href: "/support", icon: "support" }
] as const;

const helpItems = [
  { key: "faq", href: "/faq" },
  { key: "gamemodes", href: "/gamemodes" },
  { key: "rules", href: "/rules" },
  { key: "bans", href: "/bans" },
  { key: "moneyRace", href: "/money-race" }
] as const;

function NavIcon({ type }: { type: (typeof primaryItems)[number]["icon"] }) {
  if (type === "store") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path d="M5 9h14l-1 10H6L5 9Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 9a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "servers") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path d="M6 7h12M6 12h12M6 17h12" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M4 5.5h16v3H4v-3ZM4 10.5h16v3H4v-3ZM4 15.5h16v3H4v-3Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M5 18v-5a7 7 0 0 1 14 0v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 14h4v5H4v-5ZM16 14h4v5h-4v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function MainNav({ locale }: MainNavProps) {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const helpActive = helpItems.some((item) => pathname === `/${locale}${item.href}`);

  return (
    <nav aria-label={t("main")} className="w-full max-w-full">
      <ul className="flex flex-wrap items-center justify-center gap-2 text-sm font-black text-zinc-300">
        {primaryItems.map((item) => {
          const href = `/${locale}${item.href}`;
          const isActive = pathname === href;

          return (
            <li key={item.href}>
              <Link
                href={href}
                className={cn(
                  "focus-ring flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2.5 transition",
                  isActive
                    ? "border-orange-400/70 bg-orange-500 text-black shadow-lg shadow-orange-950/30"
                    : "border-white/10 bg-white/[0.045] text-zinc-200 hover:border-orange-300/45 hover:bg-orange-500/10 hover:text-orange-100"
                )}
              >
                <NavIcon type={item.icon} />
                {t(item.key)}
              </Link>
            </li>
          );
        })}
        <li className="relative">
          <details className="group">
            <summary
              className={cn(
                "focus-ring flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border px-4 py-2.5 transition marker:hidden [&::-webkit-details-marker]:hidden",
                helpActive
                  ? "border-orange-400/70 bg-orange-500/15 text-orange-100 shadow-inner shadow-orange-950/20"
                  : "border-white/10 bg-white/[0.045] text-zinc-200 hover:border-orange-300/45 hover:bg-orange-500/10 hover:text-orange-100"
              )}
            >
              {locale === "ru" ? "Помощь" : "Help"}
              <span className="h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-current opacity-70 transition group-open:rotate-180" />
            </summary>
            <div className="absolute left-0 top-full z-50 mt-3 w-64 rounded-xl border border-orange-200/10 bg-[#11131a] p-2 shadow-2xl shadow-black/40">
              {helpItems.map((item) => {
                const href = `/${locale}${item.href}`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "focus-ring block rounded-lg px-4 py-3 text-base transition",
                      isActive
                        ? "bg-orange-500/15 text-orange-100"
                        : "text-zinc-200 hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
          </details>
        </li>
      </ul>
    </nav>
  );
}
