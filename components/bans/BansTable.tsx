"use client";

import { useMemo, useState } from "react";
import type { BanRecord, Locale } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";

export function BansTable({ bans, locale }: { bans: BanRecord[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      bans.filter((ban) =>
        `${ban.player} ${getLocalizedValue(ban.reason, locale)} ${getLocalizedValue(ban.server, locale)}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [bans, locale, query]
  );

  return (
    <div>
      <label className="mb-3 block text-sm font-bold text-zinc-300" htmlFor="ban-search">
        {locale === "ru" ? "Поиск по банам" : "Search bans"}
      </label>
      <input
        id="ban-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={locale === "ru" ? "Игрок, причина или сервер" : "Player, reason, or server"}
        className="mb-5 w-full rounded-md border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
      />
      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.06] text-zinc-300">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Server</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ban) => (
              <tr key={ban.id} className="border-t border-white/10">
                <td className="px-4 py-3 font-bold text-white">{ban.player}</td>
                <td className="px-4 py-3 text-zinc-300">{getLocalizedValue(ban.reason, locale)}</td>
                <td className="px-4 py-3 text-zinc-300">{getLocalizedValue(ban.server, locale)}</td>
                <td className="px-4 py-3 text-zinc-300">{ban.date}</td>
                <td className="px-4 py-3 text-orange-300">{getLocalizedValue(ban.status, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
