import Link from "next/link";
import type { Locale, Server } from "@/types/content";
import { formatNumber } from "@/lib/localized";
import { StatCard } from "@/components/ui/StatCard";

export function ServerStatusPreview({
  locale,
  servers
}: {
  locale: Locale;
  servers: Server[];
}) {
  const totalOnline = servers.reduce((sum, server) => sum + server.online, 0);
  const totalCapacity = servers.reduce((sum, server) => sum + server.capacity, 0);
  const activeServers = servers.filter((server) => server.status === "online").length;

  return (
    <section className="py-10 sm:py-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">
            {locale === "ru" ? "Живой статус серверов" : "Live server status"}
          </h2>
          <p className="mt-2 text-zinc-400">
            {locale === "ru" ? "Статичная витрина текущей структуры сети." : "A static preview of the current network structure."}
          </p>
        </div>
        <Link className="focus-ring rounded-md text-sm font-bold text-orange-300 hover:text-orange-100" href={`/${locale}/servers`}>
          {locale === "ru" ? "Все серверы" : "All servers"}
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={locale === "ru" ? "Онлайн" : "Online"} value={`${formatNumber(totalOnline, locale)}/${formatNumber(totalCapacity, locale)}`} />
        <StatCard label={locale === "ru" ? "Активные серверы" : "Active servers"} value={formatNumber(activeServers, locale)} />
        <StatCard label={locale === "ru" ? "Регион" : "Region"} value="EU" />
      </div>
    </section>
  );
}
