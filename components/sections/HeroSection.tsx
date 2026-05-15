import Link from "next/link";
import type { Locale } from "@/types/content";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { Badge } from "@/components/ui/Badge";

const copy = {
  ru: {
    title: "RUST24",
    lead: "Сеть Rust-серверов с быстрыми вайпами, честной игрой и понятной структурой режимов.",
    primary: "Смотреть серверы",
    secondary: "Войти через Steam",
    note: "Steam-вход пока является статичным CTA."
  },
  en: {
    title: "RUST24",
    lead: "A Rust server network with fast wipes, fair gameplay, and clear game mode structure.",
    primary: "View servers",
    secondary: "Login with Steam",
    note: "Steam login is still a static CTA."
  }
} as const;

export function HeroSection({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="relative grid min-h-[calc(100svh-9rem)] gap-8 overflow-hidden py-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="absolute left-1/2 top-8 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/15 blur-3xl" />
      <div>
        <h1 className="text-6xl font-black leading-[0.82] tracking-tight text-white sm:text-8xl lg:text-9xl">
          {t.title}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
          {t.lead}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/servers`}
            className="primary-cta"
          >
            {t.primary}
          </Link>
          <a
            href={`/api/auth/steam?locale=${locale}&returnTo=/${locale}/profile`}
            className="secondary-cta"
          >
            {t.secondary}
          </a>
        </div>
        <p className="mt-4 text-sm text-zinc-500">{t.note}</p>
      </div>
      <SurfaceCard className="relative overflow-hidden p-5 sm:p-6">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="relative aspect-[4/3] rounded-lg border border-white/10 bg-black/35 p-5">
          <div className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,rgba(249,115,22,0.18),transparent_38%),repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_24px)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <Badge variant="amber">EU NETWORK</Badge>
              <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.85)]" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-400">
                Rust server network
              </p>
              <div className="mt-4 grid gap-3">
                {["Fast wipes", "Fair play", "Live status"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 shadow-inner shadow-white/5"
                  >
                    <span className="font-bold text-white">{item}</span>
                    <span className="h-2 w-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </section>
  );
}
