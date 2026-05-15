import type { LeaderboardEntry, Locale } from "@/types/content";
import { formatNumber, getLocalizedValue } from "@/lib/localized";

export function LeaderboardTable({
  entries,
  locale
}: {
  entries: LeaderboardEntry[];
  locale: Locale;
}) {
  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-white/[0.06] text-zinc-300">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">{locale === "ru" ? "Игрок" : "Player"}</th>
            <th className="px-4 py-3">{locale === "ru" ? "Очки" : "Score"}</th>
            <th className="px-4 py-3">{locale === "ru" ? "Сервер" : "Server"}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={`${entry.rank}-${entry.player}`} className="border-t border-white/10">
              <td className="px-4 py-3 font-black text-orange-300">#{entry.rank}</td>
              <td className="px-4 py-3 font-bold text-white">{entry.player}</td>
              <td className="px-4 py-3 text-zinc-300">{formatNumber(entry.score, locale)}</td>
              <td className="px-4 py-3 text-zinc-300">{getLocalizedValue(entry.server, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
