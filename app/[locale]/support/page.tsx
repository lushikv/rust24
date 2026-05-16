import Link from "next/link";
import { createPlaceholderMetadata } from "@/lib/pages";
import type { Locale } from "@/config/locales";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { SupportChannelCard } from "@/components/support/SupportChannelCard";
import { getSupportChannels } from "@/lib/repositories/support";
import { PageHero } from "@/components/ui/PageHero";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createPlaceholderMetadata("support", locale);
}

export default async function SupportPage({ params }: PageProps) {
  const { locale } = await params;
  const supportChannels = await getSupportChannels();
  const visibleSupportChannels = supportChannels.filter((channel) =>
    ["discord", "email"].includes(channel.id)
  );

  return (
    <div className="w-full space-y-8">
      <PageHero
        title={locale === "ru" ? "Поддержка" : "Support"}
        description={
          locale === "ru"
            ? "Каналы связи, предупреждения о мошенниках и быстрые ссылки для будущего сообщества RUST24."
            : "Contact channels, scam warnings, and quick links for the future RUST24 community."
        }
        accent="COMMS"
      />
      <section className="grid gap-4 md:grid-cols-2">
        {visibleSupportChannels.map((channel) => (
          <SupportChannelCard key={channel.id} channel={channel} locale={locale} />
        ))}
      </section>
      <section className="surface-card border-orange-500/25 p-5">
        <h2 className="text-2xl font-black text-white">
          {locale === "ru" ? "Остерегайтесь мошенников" : "Watch for scams"}
        </h2>
        <p className="mt-2 text-zinc-300">
          {locale === "ru"
            ? "Администраторы не просят пароль, коды подтверждения или скины через личные сообщения."
            : "Admins do not ask for passwords, verification codes, or skins through private messages."}
        </p>
        <div className="mt-4 flex gap-3 text-sm font-bold">
          <Link href={`/${locale}/faq`} className="text-orange-300 hover:text-orange-200">FAQ</Link>
          <Link href={`/${locale}/rules`} className="text-orange-300 hover:text-orange-200">
            {locale === "ru" ? "Правила" : "Rules"}
          </Link>
        </div>
      </section>
      <BreadcrumbJsonLd locale={locale} routeKey="support" />
    </div>
  );
}
