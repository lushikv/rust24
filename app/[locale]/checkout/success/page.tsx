import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import type { Locale } from "@/config/locales";
import { createNoIndexMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createNoIndexMetadata({
    locale,
    path: "/checkout/success",
    title: locale === "ru" ? "Checkout success RUST24" : "RUST24 Checkout Success",
    description:
      locale === "ru"
        ? "Приватная placeholder-страница checkout."
        : "Private checkout placeholder page."
  });
}

export default async function CheckoutSuccessPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <PageHero
      accent={locale === "ru" ? "Checkout placeholder" : "Checkout placeholder"}
      title={locale === "ru" ? "Платежи не подключены" : "Payments are not connected"}
      description={
        locale === "ru"
          ? "Платежный поток пока не реализован. Эта страница является безопасной заготовкой для будущего провайдера."
          : "Payment flow is not implemented yet. This page is a safe placeholder for a future provider."
      }
    />
  );
}
