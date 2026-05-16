import type { Currency, Locale, Server } from "@/types/content";

export const homeCurrency: Currency = "RUB";

export function getServerTotals(servers: Server[]) {
  return servers.reduce(
    (total, server) => ({
      online: total.online + server.online,
      capacity: total.capacity + server.capacity,
      active: total.active + (server.status === "online" ? 1 : 0)
    }),
    { online: 0, capacity: 0, active: 0 }
  );
}

export function getServerStatusLabel(status: Server["status"], locale: Locale) {
  if (status === "online") {
    return locale === "ru" ? "Online" : "Online";
  }

  if (status === "maintenance") {
    return locale === "ru" ? "Техработы" : "Maintenance";
  }

  return locale === "ru" ? "Offline" : "Offline";
}

export function getServerStatusClasses(status: Server["status"]) {
  if (status === "online") {
    return "border-emerald-300/35 bg-emerald-400/12 text-emerald-100";
  }

  if (status === "maintenance") {
    return "border-orange-300/35 bg-orange-400/12 text-orange-100";
  }

  return "border-zinc-400/20 bg-zinc-400/10 text-zinc-300";
}
