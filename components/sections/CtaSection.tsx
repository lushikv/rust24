import Link from "next/link";
import type { Locale } from "@/types/content";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function CtaSection({ locale }: { locale: Locale }) {
  return (
    <SurfaceCard as="section" className="my-10 overflow-hidden p-7 text-center sm:p-10">
      <h2 className="text-3xl font-black text-white sm:text-5xl">
        {locale === "ru" ? "Готовы к следующему вайпу?" : "Ready for the next wipe?"}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
        {locale === "ru"
          ? "Проверьте серверы, правила и каналы поддержки перед стартом."
          : "Check servers, rules, and support channels before jumping in."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/${locale}/servers`} className="primary-cta">
          {locale === "ru" ? "К серверам" : "To servers"}
        </Link>
        <Link href={`/${locale}/support`} className="secondary-cta">
          {locale === "ru" ? "Поддержка" : "Support"}
        </Link>
      </div>
    </SurfaceCard>
  );
}
