import Link from "next/link";
import type { GameMode, Locale } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function GameModeCard({ mode, locale }: { mode: GameMode; locale: Locale }) {
  return (
    <SurfaceCard as="article" interactive className="p-5">
      <h2 className="text-xl font-black text-white">{getLocalizedValue(mode.title, locale)}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{getLocalizedValue(mode.summary, locale)}</p>
      <ul className="mt-4 space-y-2">
        {mode.features.map((feature) => (
          <li key={getLocalizedValue(feature, locale)} className="flex gap-2 text-sm text-zinc-300">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span>{getLocalizedValue(feature, locale)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-3 text-sm font-bold">
        <Link href={`/${locale}/servers`} className="focus-ring rounded-md text-orange-300 hover:text-orange-100">
          {locale === "ru" ? "К серверам" : "To servers"}
        </Link>
        <Link href={`/${locale}/store`} className="focus-ring rounded-md text-zinc-300 hover:text-white">
          {locale === "ru" ? "Магазин" : "Store"}
        </Link>
      </div>
    </SurfaceCard>
  );
}
