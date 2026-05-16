"use client";

import { useMemo, useState } from "react";
import type { Locale, Server } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";
import { cn } from "@/lib/utils";

type ModeOption = {
  key: string;
  label: string;
  description: string;
  count: number;
};

export function ServerModeTabs({
  locale,
  servers,
  activeKey,
  onModeChange
}: {
  locale: Locale;
  servers: Server[];
  activeKey?: string;
  onModeChange?: (key: string) => void;
}) {
  const modes = useMemo(() => getModes(locale, servers), [locale, servers]);
  const [localActiveKey, setLocalActiveKey] = useState(modes[0]?.key ?? "all");
  const selectedKey = activeKey ?? localActiveKey;
  const activeMode = modes.find((mode) => mode.key === selectedKey) ?? modes[0];

  function selectMode(key: string) {
    setLocalActiveKey(key);
    onModeChange?.(key);
  }

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-200/75">
            {locale === "ru" ? "Выбор режима" : "Mode selector"}
          </p>
          <h2 className="mt-2 section-title">
            {locale === "ru" ? "Найди свой вайп" : "Find your wipe"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/25 p-2">
          {modes.map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => selectMode(mode.key)}
              className={cn(
                "focus-ring rounded-xl px-4 py-2 text-sm font-black transition",
                mode.key === selectedKey
                  ? "bg-orange-500 text-black shadow-[0_0_24px_rgba(249,115,22,0.28)]"
                  : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-orange-100"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {activeMode ? (
        <div className="mt-5 rounded-2xl border border-orange-200/15 bg-black/20 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-black text-white">{activeMode.label}</p>
            <span className="text-sm font-bold text-orange-200">
              {locale === "ru"
                ? `${activeMode.count} серверов в сетке`
                : `${activeMode.count} servers in network`}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            {activeMode.description}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export function getServerModeKey(server: Server, locale: Locale) {
  return getLocalizedValue(server.mode, locale).toLowerCase().replace(/\s+/g, "-");
}

function getModes(locale: Locale, servers: Server[]): ModeOption[] {
  const uniqueModes = Array.from(
    new Map(
      servers.map((server) => {
        const label = getLocalizedValue(server.mode, locale);
        return [
          label.toLowerCase(),
          {
            key: getServerModeKey(server, locale),
            label,
            count: servers.filter(
              (item) => getLocalizedValue(item.mode, locale).toLowerCase() === label.toLowerCase()
            ).length
          }
        ];
      })
    ).values()
  );

  const descriptions =
    locale === "ru"
      ? {
          all: "Все доступные форматы Rust24 в одном списке: от спокойного соло до активных командных вайпов.",
          fallback:
            "Режим выбран визуально: ниже остаются все серверы, чтобы не скрывать доступные варианты без явного фильтра."
        }
      : {
          all: "All available Rust24 formats in one list: from careful solo play to active team wipes.",
          fallback:
            "The mode is selected visually: the sections below stay complete until explicit filtering is added."
        };

  return [
    {
      key: "all",
      label: locale === "ru" ? "Все режимы" : "All modes",
      count: servers.length,
      description: descriptions.all
    },
    ...uniqueModes.map((mode) => ({
      ...mode,
      description: descriptions.fallback
    }))
  ];
}
