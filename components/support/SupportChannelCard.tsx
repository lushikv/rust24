import type { Locale, SupportChannel } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export function SupportChannelCard({
  channel,
  locale
}: {
  channel: SupportChannel;
  locale: Locale;
}) {
  return (
    <SurfaceCard as="article" interactive className="p-5">
      <h2 className="text-xl font-black text-white">{getLocalizedValue(channel.title, locale)}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        {getLocalizedValue(channel.description, locale)}
      </p>
      <p className="mt-4 text-sm text-orange-300">
        {locale === "ru" ? "Ответ: " : "Response: "}
        {getLocalizedValue(channel.responseTime, locale)}
      </p>
      <a
        href={channel.href}
        className="secondary-cta mt-5 px-4 py-2"
      >
        {locale === "ru" ? "Открыть" : "Open"}
      </a>
    </SurfaceCard>
  );
}
