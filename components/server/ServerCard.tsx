import type { Locale, Server } from "@/types/content";
import { formatNumber, getLocalizedValue } from "@/lib/localized";
import { Badge } from "@/components/ui/Badge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { ConnectCommand } from "@/components/server/ConnectCommand";

const statusClass = {
  online: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  maintenance: "bg-orange-400/15 text-orange-300 border-orange-400/30",
  offline: "bg-zinc-400/15 text-zinc-300 border-zinc-400/30"
} as const;

export function ServerCard({ server, locale }: { server: Server; locale: Locale }) {
  const online = formatNumber(server.online, locale);
  const capacity = formatNumber(server.capacity, locale);
  const percent = Math.min(100, Math.round((server.online / Math.max(server.capacity, 1)) * 100));
  const mode = getLocalizedValue(server.mode, locale);
  const teamLimit = getLocalizedValue(server.teamLimit, locale);

  return (
    <SurfaceCard as="article" interactive className="flex h-full flex-col p-5">
      <div className="grid min-h-36 content-start gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-xl font-black text-white">
            {getLocalizedValue(server.name, locale)}
          </h2>
          <span className={`rounded-sm border px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] ${statusClass[server.status]}`}>
            {server.status}
          </span>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-zinc-400">
          {getLocalizedValue(server.description, locale)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge>{server.region}</Badge>
          <Badge>{mode}</Badge>
          <Badge>{teamLimit}</Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
            <span>{locale === "ru" ? "Заполненность" : "Population"}</span>
            <span className="text-orange-200">{online}/{capacity}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/45">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-400 to-amber-200"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <ServerMetric label="Online" value={`${online}/${capacity}`} />
          <ServerMetric label="Region" value={server.region} />
          <ServerMetric label="Mode" value={mode} />
          <ServerMetric label="Team" value={teamLimit} />
        </dl>

        <p className="min-h-6 text-sm text-zinc-400">
          {getLocalizedValue(server.wipeSchedule, locale)}
        </p>
      </div>

      <div className="mt-auto pt-4">
        <ConnectCommand command={server.connectCommand} locale={locale} />
      </div>
    </SurfaceCard>
  );
}

function ServerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-14">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-bold text-white">{value}</dd>
    </div>
  );
}
