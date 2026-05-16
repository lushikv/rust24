"use client";

import Link from "next/link";
import type { Locale, Server } from "@/types/content";
import { formatNumber, getLocalizedValue } from "@/lib/localized";
import { CopyConnectButton } from "@/components/home/CopyConnectButton";
import {
  getServerStatusClasses,
  getServerStatusLabel,
  getServerTotals
} from "@/components/home/home-utils";

export function ServerStatusGrid({
  locale,
  servers
}: {
  locale: Locale;
  servers: Server[];
}) {
  const copy = getServersCopy(locale);
  const totals = getServerTotals(servers);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-200/75">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 section-title">{copy.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{copy.description}</p>
        </div>
        <div className="rounded-2xl border border-orange-200/15 bg-black/25 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
            {copy.online}
          </p>
          <p className="mt-1 text-2xl font-black text-white">
            {formatNumber(totals.online, locale)} / {formatNumber(totals.capacity, locale)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {servers.map((server) => (
          <ServerPanel key={server.id} locale={locale} server={server} />
        ))}
      </div>
    </section>
  );
}

function ServerPanel({ server, locale }: { server: Server; locale: Locale }) {
  const copy = getServersCopy(locale);
  const percent = Math.min(100, Math.round((server.online / server.capacity) * 100));

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111217]/90 p-5 shadow-2xl shadow-black/30 transition duration-200 hover:-translate-y-1 hover:border-orange-300/45 hover:shadow-[0_22px_70px_rgba(0,0,0,0.4),0_0_34px_rgba(249,115,22,0.14)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(249,115,22,0.15),transparent_18rem)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-white">
              {getLocalizedValue(server.name, locale)}
            </h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">
              {getLocalizedValue(server.description, locale)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${getServerStatusClasses(server.status)}`}
          >
            {getServerStatusLabel(server.status, locale)}
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="flex items-end justify-between gap-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
              {copy.capacity}
            </span>
            <strong className="text-lg text-orange-100">
              {server.online}/{server.capacity}
            </strong>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/55">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-400 to-amber-200"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <ServerField label={copy.mode} value={getLocalizedValue(server.mode, locale)} />
          <ServerField label={copy.region} value={server.region} />
          <ServerField label={copy.team} value={getLocalizedValue(server.teamLimit, locale)} />
          <ServerField label={copy.queue} value={String(server.queue ?? 0)} />
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          {server.tags.slice(0, 3).map((tag) => (
            <span
              key={getLocalizedValue(tag, locale)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-zinc-300"
            >
              {getLocalizedValue(tag, locale)}
            </span>
          ))}
        </div>

        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-zinc-300">
          {getLocalizedValue(server.wipeSchedule, locale)}
        </p>

        <div className="mt-4 rounded-2xl border border-orange-300/20 bg-black/25 p-3 transition duration-200 hover:border-orange-200/55 hover:shadow-[0_0_26px_rgba(249,115,22,0.18)]">
          <p className="mb-2 text-center text-xs font-black uppercase tracking-[0.22em] text-orange-200/70">
            {copy.connect}
          </p>
          <div className="flex min-w-0 items-center gap-1.5">
            <code className="min-w-0 max-w-full flex-1 overflow-x-auto whitespace-nowrap rounded-xl border border-white/10 bg-[#07080b]/80 px-2.5 py-3 text-[13px] text-orange-50 [scrollbar-width:thin] [scrollbar-color:rgba(249,115,22,0.75)_rgba(255,255,255,0.06)] 2xl:text-sm">
              {server.connectCommand}
            </code>
            <CopyConnectButton
              command={server.connectCommand}
              locale={locale}
              className="h-10 w-10 rounded-lg"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a className="primary-cta" href={`steam://connect/${server.connectCommand.replace(/^connect\s+/i, "")}`}>
            {copy.join}
          </a>
          <Link className="secondary-cta" href={`/${locale}/servers`}>
            {copy.details}
          </Link>
        </div>
      </div>
    </article>
  );
}

function ServerField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="mt-1 font-black text-white">{value}</dd>
    </div>
  );
}

function getServersCopy(locale: Locale) {
  if (locale === "ru") {
    return {
      eyebrow: "Server grid",
      title: "Наши сервера",
      description:
        "Актуальный онлайн, команды подключения и формат вайпа собраны в одном dashboard-блоке.",
      online: "Общий онлайн",
      capacity: "Заполненность",
      mode: "Режим",
      region: "Регион",
      team: "Команда",
      queue: "Очередь",
      connect: "Команда подключения",
      join: "Подключиться",
      details: "Подробнее"
    };
  }

  return {
    eyebrow: "Server grid",
    title: "Our servers",
    description:
      "Live online, connect commands, and wipe format are collected in one dashboard block.",
    online: "Total online",
    capacity: "Capacity",
    mode: "Mode",
    region: "Region",
    team: "Team",
    queue: "Queue",
    connect: "Connect command",
    join: "Join",
    details: "Details"
  };
}
