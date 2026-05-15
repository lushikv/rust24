"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { navItems } from "@/config/navigation";
import type { Locale } from "@/config/locales";
import { cn } from "@/lib/utils";

type MainNavProps = {
  locale: Locale;
};

export function MainNav({ locale }: MainNavProps) {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  return (
    <nav aria-label={t("main")} className="-mx-1 overflow-x-auto px-1">
      <ul className="flex min-w-max gap-1.5 text-sm font-semibold text-zinc-300">
        {navItems.map((item) => {
          const href = `/${locale}${item.href}`;
          const isActive = pathname === href;

          return (
            <li key={item.href}>
              <Link
                href={href}
                className={cn(
                  "focus-ring block rounded-md border px-3 py-2 transition",
                  isActive
                    ? "border-orange-400/70 bg-orange-500/15 text-orange-100 shadow-inner shadow-orange-950/20"
                    : "border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white"
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
