"use client";

import { useEffect, useMemo, useState } from "react";
import { ServerCard } from "@/components/server/ServerCard";
import type { Locale, Server } from "@/types/content";
import type { PublicServerStatus, ServerStatusApiResponse } from "@/types/server-status";

const DEFAULT_POLL_INTERVAL_MS = 30000;

function mergeStatuses(servers: Server[], statuses: PublicServerStatus[]) {
  const bySlug = new Map(statuses.map((status) => [status.slug, status]));

  return servers.map((server) => {
    const status = bySlug.get(server.id);

    if (!status) {
      return server;
    }

    return {
      ...server,
      status: status.status,
      online: status.online,
      queue: status.queue,
      capacity: status.capacity
    };
  });
}

export function LiveServerStatus({
  initialServers,
  locale,
  pollIntervalMs = DEFAULT_POLL_INTERVAL_MS
}: {
  initialServers: Server[];
  locale: Locale;
  pollIntervalMs?: number;
}) {
  const [statuses, setStatuses] = useState<PublicServerStatus[]>([]);
  const [source, setSource] = useState<string>("server");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const response = await fetch("/api/public/servers/status", {
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          throw new Error("Status request failed.");
        }

        const payload = (await response.json()) as ServerStatusApiResponse;

        if (active) {
          setStatuses(payload.servers);
          setSource(payload.source);
          setUpdatedAt(payload.updatedAt);
          setFailed(false);
        }
      } catch {
        if (active) {
          setFailed(true);
        }
      }
    }

    loadStatus();
    const interval = window.setInterval(loadStatus, pollIntervalMs);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [pollIntervalMs]);

  const servers = useMemo(
    () => mergeStatuses(initialServers, statuses),
    [initialServers, statuses]
  );

  return (
    <div className="space-y-4">
      <div className="metal-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-zinc-400">
        <span>
          {locale === "ru" ? "Источник статуса" : "Status source"}:{" "}
          <strong className="text-orange-300">{failed ? "server-rendered" : source}</strong>
        </span>
        <span>
          {updatedAt
            ? new Intl.DateTimeFormat(locale, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              }).format(new Date(updatedAt))
            : locale === "ru"
              ? "ожидание обновления"
              : "waiting for update"}
        </span>
      </div>
      {servers.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
        {servers.map((server) => (
          <ServerCard key={server.id} server={server} locale={locale} />
        ))}
        </section>
      ) : (
        <div className="surface-card p-6 text-sm leading-6 text-zinc-300">
          {locale === "ru"
            ? "Под выбранный фильтр сейчас нет серверов."
            : "No servers match the selected filter right now."}
        </div>
      )}
    </div>
  );
}
