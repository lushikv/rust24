import Link from "next/link";
import type { Locale } from "@/types/content";
import { cn } from "@/lib/utils";

export type ServerFilterValue = "all" | "online" | "solo" | "duo" | "vanilla";

const filters: Array<{ value: ServerFilterValue; label: Record<Locale, string> }> = [
  { value: "all", label: { ru: "Все", en: "All" } },
  { value: "online", label: { ru: "Онлайн", en: "Online" } },
  { value: "solo", label: { ru: "Соло", en: "Solo" } },
  { value: "duo", label: { ru: "Дуо", en: "Duo" } },
  { value: "vanilla", label: { ru: "Vanilla+", en: "Vanilla+" } }
] as const;

const countLabel = {
  ru: "серверов",
  en: "servers"
} as const;

export function ServerFilters({
  locale,
  activeFilter,
  counts
}: {
  locale: Locale;
  activeFilter: ServerFilterValue;
  counts: Record<ServerFilterValue, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label={locale === "ru" ? "Фильтры серверов" : "Server filters"}>
      {filters.map((filter) => (
        <Link
          key={filter.value}
          href={
            filter.value === "all"
              ? `/${locale}/servers`
              : `/${locale}/servers?filter=${filter.value}`
          }
          aria-current={activeFilter === filter.value ? "page" : undefined}
          className={cn(
            "rounded-md border px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-orange-300",
            activeFilter === filter.value
              ? "border-orange-300/60 bg-orange-500 text-black shadow-lg shadow-orange-950/25"
              : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-orange-400 hover:text-white"
          )}
        >
          {filter.label[locale]}{" "}
          <span className={activeFilter === filter.value ? "text-black/60" : "text-zinc-500"}>
            {counts[filter.value]}
          </span>
        </Link>
      ))}
      <span className="self-center text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
        {counts[activeFilter]} {countLabel[locale]}
      </span>
    </div>
  );
}
