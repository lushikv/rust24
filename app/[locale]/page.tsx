import type { Metadata } from "next";
import { ConnectSteps } from "@/components/home/ConnectSteps";
import { HomeServerBrowser } from "@/components/home/HomeServerBrowser";
import { HomeHero } from "@/components/home/HomeHero";
import { ProductPreviewGrid } from "@/components/home/ProductPreviewGrid";
import { PromoEventCard } from "@/components/home/PromoEventCard";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/config/locales";
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
  const [servers, products, moneyRace] = await Promise.all([
    getFeaturedServers(),
    getFeaturedProducts(locale),
    getActiveMoneyRaceSeason()
  ]);

  return (
    <>
      <div className="w-full space-y-8">
        <HomeHero locale={locale} season={moneyRace} servers={servers} />
        <PromoEventCard locale={locale} season={moneyRace} />
        <ProductPreviewGrid locale={locale} products={products} />
        <HomeServerBrowser locale={locale} servers={servers} />
        <ConnectSteps locale={locale} />
      </div>
      <JsonLd data={createOrganizationJsonLd(locale)} />
      <JsonLd data={createWebSiteJsonLd(locale)} />
    </>
  );
}
