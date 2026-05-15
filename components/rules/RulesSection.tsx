import type { Locale, RuleSection as RuleSectionType } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function RulesSection({
  section,
  locale
}: {
  section: RuleSectionType;
  locale: Locale;
}) {
  return (
    <SurfaceCard as="section" className="p-5">
      <div className={`mb-4 rounded-md border px-3 py-2 text-sm font-bold ${
        section.severity === "warning"
          ? "border-orange-400/30 bg-orange-400/10 text-orange-200"
          : "border-white/10 bg-white/[0.03] text-zinc-300"
      }`}>
        {getLocalizedValue(section.description, locale)}
      </div>
      <h2 className="text-2xl font-black text-white">{getLocalizedValue(section.title, locale)}</h2>
      <ol className="mt-4 space-y-3">
        {section.items.map((item, index) => (
          <li key={getLocalizedValue(item, locale)} className="flex gap-3 text-zinc-300">
            <span className="font-black text-orange-300">{index + 1}</span>
            <span>{getLocalizedValue(item, locale)}</span>
          </li>
        ))}
      </ol>
    </SurfaceCard>
  );
}
