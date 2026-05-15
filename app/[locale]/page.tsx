import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { FeaturedModes } from "@/components/sections/FeaturedModes";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { HeroSection } from "@/components/sections/HeroSection";
import { MoneyRacePromo } from "@/components/sections/MoneyRacePromo";
import { ServerStatusPreview } from "@/components/sections/ServerStatusPreview";
import type { Locale } from "@/config/locales";
import { getFAQPreview } from "@/lib/repositories/faq";
import { getFeaturedGameModes } from "@/lib/repositories/gamemodes";
import { getActiveMoneyRaceSeason } from "@/lib/repositories/money-race";
import { getFeaturedProducts } from "@/lib/repositories/products";
import { getFeaturedServers } from "@/lib/repositories/servers";
import { createPageMetadata } from "@/lib/seo";
import {
  createOrganizationJsonLd,
  createWebSiteJsonLd
} from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata("home", locale);
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const [servers, modes, products, faqItems, moneyRace] = await Promise.all([
    getFeaturedServers(),
    getFeaturedGameModes(),
    getFeaturedProducts(locale),
    getFAQPreview(),
    getActiveMoneyRaceSeason()
  ]);

  return (
    <>
      <div className="w-full">
        <HeroSection locale={locale} />
        <ServerStatusPreview locale={locale} servers={servers} />
        <FeaturedModes locale={locale} modes={modes} />
        <FeaturedProducts locale={locale} products={products} />
        <MoneyRacePromo locale={locale} season={moneyRace} />
        <FaqPreview locale={locale} items={faqItems} />
        <CtaSection locale={locale} />
      </div>
      <JsonLd data={createOrganizationJsonLd(locale)} />
      <JsonLd data={createWebSiteJsonLd(locale)} />
    </>
  );
}
