import Link from "next/link";
import type { Locale, MoneyRaceSeason, Server } from "@/types/content";
import { formatNumber, getLocalizedValue } from "@/lib/localized";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CopyConnectButton } from "@/components/home/CopyConnectButton";
import {
  getServerStatusClasses,
  getServerStatusLabel,
  getServerTotals
} from "@/components/home/home-utils";

export function HomeHero({
  locale,
  servers,
  season
}: {
  locale: Locale;
  servers: Server[];
  season: MoneyRaceSeason | null;
}) {
  const totals = getServerTotals(servers);
  const activeServer =
    servers.find((server) => server.status === "online") ?? servers[0] ?? null;
  const activePercent = activeServer
    ? Math.min(100, Math.round((activeServer.online / activeServer.capacity) * 100))
    : 0;
  const labels = getHeroLabels(locale);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-orange-200/12 bg-[#111016] px-5 py-8 shadow-2xl shadow-black/45 sm:px-8 lg:px-10 lg:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(249,115,22,0.25),transparent_26rem),radial-gradient(circle_at_82%_0%,rgba(255,176,0,0.13),transparent_20rem),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015)_42%,rgba(0,0,0,0.25))]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-orange-600/20 blur-3xl" />

      <div className="relative grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.75fr)] lg:items-center">
        <div className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {labels.badges.map((badge) => (
              <Badge key={badge} variant="amber" className="bg-black/20">
                {badge}
              </Badge>
            ))}
          </div>

          <h1 className="mt-5 max-w-full break-words text-4xl font-black leading-[0.95] tracking-tight text-white sm:max-w-4xl sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
            {labels.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            {labels.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/${locale}/servers`} className="min-h-12 px-7 text-base">
              {labels.play}
            </ButtonLink>
            <ButtonLink
              href={`/${locale}/store`}
              variant="secondary"
              className="min-h-12 px-7 text-base"
            >
              {labels.store}
            </ButtonLink>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <HeroStat label={labels.online} value={`${formatNumber(totals.online, locale)} / ${formatNumber(totals.capacity, locale)}`} />
            <HeroStat label={labels.servers} value={formatNumber(servers.length, locale)} />
            <HeroStat
              label={labels.wipe}
              value={
                activeServer
                  ? getCompactWipeValue(getLocalizedValue(activeServer.wipeSchedule, locale), locale)
                  : labels.soon
              }
            />
            <HeroStat label={labels.modes} value={labels.modeList} />
          </dl>
        </div>

        <div className="relative h-full">
          <div className="absolute -inset-3 rounded-3xl bg-orange-500/10 blur-2xl" />
          <article className="surface-card surface-card-hover relative flex h-full flex-col overflow-hidden rounded-2xl border-orange-200/20 p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-600 via-amber-300 to-transparent" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200/80">
                  {season ? labels.season : labels.activeServer}
                </p>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  {activeServer
                    ? getLocalizedValue(activeServer.name, locale)
                    : labels.serverFallback}
                </h2>
              </div>
              {activeServer ? (
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${getServerStatusClasses(activeServer.status)}`}
                >
                  {getServerStatusLabel(activeServer.status, locale)}
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {activeServer
                ? getLocalizedValue(activeServer.description, locale)
                : labels.serverDescriptionFallback}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-end justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                  {labels.capacity}
                </span>
                <strong className="text-xl text-orange-100">
                  {activeServer
                    ? `${activeServer.online}/${activeServer.capacity}`
                    : "0/0"}
                </strong>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-400 to-amber-200 shadow-[0_0_24px_rgba(249,115,22,0.35)]"
                  style={{ width: `${activePercent}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <HeroMini label={labels.mode} value={activeServer ? getLocalizedValue(activeServer.mode, locale) : "-"} />
              <HeroMini label={labels.region} value={activeServer?.region ?? "-"} />
              <HeroMini label={labels.team} value={activeServer ? getLocalizedValue(activeServer.teamLimit, locale) : "-"} />
              <HeroMini label={labels.queue} value={String(activeServer?.queue ?? 0)} />
            </div>

            {activeServer ? (
              <div className="mt-5 rounded-2xl border border-orange-300/25 bg-black/25 p-3 transition duration-200 hover:border-orange-200/55 hover:shadow-[0_0_26px_rgba(249,115,22,0.2)]">
                <div className="mb-2 text-center text-xs font-black uppercase tracking-[0.22em] text-orange-200/75">
                  {labels.connect}
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <code className="min-w-0 max-w-full flex-1 overflow-x-auto whitespace-nowrap rounded-xl border border-white/10 bg-[#07080b]/80 px-3 py-3 text-sm text-orange-50 [scrollbar-width:thin] [scrollbar-color:rgba(249,115,22,0.75)_rgba(255,255,255,0.06)] sm:text-base">
                    {activeServer.connectCommand}
                  </code>
                  <CopyConnectButton command={activeServer.connectCommand} locale={locale} />
                </div>
              </div>
            ) : null}

            <Link
              href={`/${locale}/money-race`}
              className="focus-ring mt-auto inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white transition hover:border-orange-300/45 hover:bg-orange-500/10"
            >
              {labels.seasonCta}
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-24 flex-col rounded-2xl border border-white/10 bg-black/25 p-3.5 text-center shadow-inner shadow-white/5">
      <dt className="flex h-8 items-start justify-center text-xs font-black uppercase leading-4 tracking-[0.18em] text-orange-200/75">
        {label}
      </dt>
      <dd className="mt-2 text-center text-base font-black leading-5 text-white xl:text-lg xl:leading-6">
        {value}
      </dd>
    </div>
  );
}

function HeroMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 font-black text-white">{value}</div>
    </div>
  );
}

function getHeroLabels(locale: Locale) {
  if (locale === "ru") {
    return {
      title: "Rust24: заходи в вайп без лишних шагов",
      description:
        "Выбирай сервер, копируй команду подключения и открывай магазин с популярными наборами. Все ключевые действия доступны с первого экрана.",
      play: "Играть сейчас",
      store: "Открыть магазин",
      online: "Онлайн",
      servers: "Серверы",
      wipe: "Ближайший вайп",
      modes: "Режимы",
      modeList: "Solo / Duo / Trio / NL",
      soon: "скоро",
      badges: ["No Pay-to-Win", "Быстрый старт", "Активный онлайн"],
      activeServer: "Активный сервер",
      season: "Сезон Rust24",
      serverFallback: "Сервер готовится",
      serverDescriptionFallback: "Статусы появятся после запуска серверной сетки.",
      capacity: "Заполненность",
      mode: "Режим",
      region: "Регион",
      team: "Команда",
      queue: "Очередь",
      connect: "Команда подключения",
      seasonCta: "Открыть сезонную гонку"
    };
  }

  return {
    title: "Rust24: enter the wipe without extra steps",
    description:
      "Pick a server, copy the connect command, and open the store preview with popular kits. The key actions are available from the first screen.",
    play: "Play now",
    store: "Open store",
    online: "Online",
    servers: "Servers",
    wipe: "Next wipe",
    modes: "Modes",
    modeList: "Solo / Duo / Trio / NL",
    soon: "soon",
    badges: ["No Pay-to-Win", "Fast start", "Active online"],
    activeServer: "Active server",
    season: "Rust24 season",
    serverFallback: "Server is preparing",
    serverDescriptionFallback: "Statuses will appear after the network launch.",
    capacity: "Capacity",
    mode: "Mode",
    region: "Region",
    team: "Team",
    queue: "Queue",
    connect: "Connect command",
    seasonCta: "Open seasonal race"
  };
}

function getCompactWipeValue(value: string, locale: Locale) {
  if (locale === "ru") {
    return value
      .replace("Карта:", "Карта")
      .replace("пятница", "пт")
      .replace("раз в 2 недели", "2 недели")
      .replace(", BP:", " · BP");
  }

  return value
    .replace("Map:", "Map")
    .replace("Friday", "Fri")
    .replace("every 2 weeks", "2 weeks")
    .replace(", BP:", " · BP");
}
