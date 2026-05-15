import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { navItems } from "@/config/navigation";
import Link from "next/link";

export async function Footer() {
  const [footerT, navT, locale] = await Promise.all([
    getTranslations("footer"),
    getTranslations("navigation"),
    getLocale()
  ]);
  const footerLinks = navItems.filter((item) =>
    ["servers", "store", "rules", "support"].includes(item.key)
  );

  return (
    <footer className="mt-12 border-t border-orange-200/10 bg-black/35">
      <div className="mx-auto grid w-full max-w-7xl items-start gap-8 px-4 py-10 text-sm text-zinc-400 sm:px-6 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-2xl font-black tracking-wide text-white">
            <span className="text-orange-400">RUST</span>24
          </p>
          <p className="mt-3 max-w-xl leading-6">
            {siteConfig.name} - {footerT("stage")}. {footerT("copyright")}
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 font-bold text-zinc-300 md:justify-end"
          aria-label="Footer"
        >
          {footerLinks.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className="focus-ring rounded-sm border-b border-transparent py-1 text-sm transition hover:border-orange-300/60 hover:text-orange-100"
            >
              {navT(item.key)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
