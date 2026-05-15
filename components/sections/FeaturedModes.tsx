import Link from "next/link";
import { GameModeCard } from "@/components/gamemodes/GameModeCard";
import type { GameMode, Locale } from "@/types/content";

export function FeaturedModes({
  locale,
  modes
}: {
  locale: Locale;
  modes: GameMode[];
}) {
  return (
    <section className="py-10">
      <Header
        title={locale === "ru" ? "Режимы под разный темп" : "Modes for different pacing"}
        href={`/${locale}/gamemodes`}
        cta={locale === "ru" ? "Все режимы" : "All modes"}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {modes.map((mode) => (
          <GameModeCard key={mode.id} mode={mode} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function Header({ title, href, cta }: { title: string; href: string; cta: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="section-title">{title}</h2>
      <Link className="focus-ring rounded-md text-sm font-bold text-orange-300 hover:text-orange-100" href={href}>
        {cta}
      </Link>
    </div>
  );
}
