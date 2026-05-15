import { createPlaceholderMetadata } from "@/lib/pages";
import type { Locale } from "@/config/locales";
import { ServerFilters, type ServerFilterValue } from "@/components/server/ServerFilters";
import { LiveServerStatus } from "@/components/server/LiveServerStatus";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { formatNumber, getLocalizedValue } from "@/lib/localized";
import { getServers } from "@/lib/repositories/servers";
import { PageHero } from "@/components/ui/PageHero";
import { StatCard } from "@/components/ui/StatCard";
import type { Server } from "@/types/content";

type PageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ filter?: string }>;
};

export const revalidate = 60;

function isServerFilter(value: string | undefined): value is ServerFilterValue {
  return value === "online" || value === "solo" || value === "duo" || value === "vanilla";
}

function matchesFilter(server: Server, filter: ServerFilterValue, locale: Locale) {
  const mode = getLocalizedValue(server.mode, locale).toLowerCase();
  const teamLimit = getLocalizedValue(server.teamLimit, locale).toLowerCase();

  if (filter === "online") {
    return server.status === "online";
  }

  if (filter === "solo") {
    return mode.includes("solo") || mode.includes("соло") || teamLimit.includes("solo") || teamLimit.includes("соло");
  }

  if (filter === "duo") {
    return mode.includes("duo") || mode.includes("дуо") || teamLimit.includes("duo") || teamLimit.includes("2");
  }

  if (filter === "vanilla") {
    return mode.includes("vanilla");
  }

  return true;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createPlaceholderMetadata("servers", locale);
}

export default async function ServersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { filter } = await searchParams;
  const servers = await getServers();
  const activeFilter: ServerFilterValue = isServerFilter(filter) ? filter : "all";
  const visibleServers = servers.filter((server) => matchesFilter(server, activeFilter, locale));
  const filterCounts: Record<ServerFilterValue, number> = {
    all: servers.length,
    online: servers.filter((server) => matchesFilter(server, "online", locale)).length,
    solo: servers.filter((server) => matchesFilter(server, "solo", locale)).length,
    duo: servers.filter((server) => matchesFilter(server, "duo", locale)).length,
    vanilla: servers.filter((server) => matchesFilter(server, "vanilla", locale)).length
  };
  const pollIntervalMs = Number(process.env.PUBLIC_SERVER_STATUS_POLL_INTERVAL_MS);
  const totalOnline = servers.reduce((sum, server) => sum + server.online, 0);
  const totalCapacity = servers.reduce((sum, server) => sum + server.capacity, 0);
  const activeServers = servers.filter((server) => server.status === "online").length;

  return (
    <div className="w-full space-y-8">
      <PageHero
        title={locale === "ru" ? "Серверы RUST24" : "RUST24 Servers"}
        description={
          locale === "ru"
            ? "Тактическая панель серверов с командами подключения, расписанием вайпов и live-статусами."
            : "A tactical server board with connect commands, wipe schedules, and live status badges."
        }
        accent="SERVER GRID"
      />
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Server stats">
        <StatCard label="Online" value={`${formatNumber(totalOnline, locale)}/${formatNumber(totalCapacity, locale)}`} />
        <StatCard label={locale === "ru" ? "Активные" : "Active"} value={formatNumber(activeServers, locale)} />
        <StatCard label={locale === "ru" ? "Серверов" : "Servers"} value={formatNumber(servers.length, locale)} />
      </section>
      <ServerFilters locale={locale} activeFilter={activeFilter} counts={filterCounts} />
      <LiveServerStatus
        initialServers={visibleServers}
        locale={locale}
        pollIntervalMs={Number.isFinite(pollIntervalMs) ? pollIntervalMs : 30000}
      />
      <BreadcrumbJsonLd locale={locale} routeKey="servers" />
    </div>
  );
}
