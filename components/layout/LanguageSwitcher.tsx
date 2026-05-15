"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routing, type Locale } from "@/config/locales";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(ru|en)/, "") || "";

  return (
    <div
      aria-label="Language"
      className="flex rounded-md border border-white/10 bg-black/25 p-1 text-xs font-bold"
    >
      {routing.locales.map((targetLocale) => (
        <Link
          key={targetLocale}
          href={`/${targetLocale}${pathWithoutLocale}`}
          className={cn(
            "focus-ring rounded px-2 py-1 uppercase transition",
            targetLocale === locale
              ? "bg-orange-500 text-black"
              : "text-zinc-300 hover:bg-white/10 hover:text-white"
          )}
        >
          {targetLocale}
        </Link>
      ))}
    </div>
  );
}
