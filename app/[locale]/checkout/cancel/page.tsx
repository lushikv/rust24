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
    path: "/checkout/cancel",
    title: locale === "ru" ? "Checkout cancel RUST24" : "RUST24 Checkout Cancel",
    description:
      locale === "ru"
        ? "Приватная placeholder-страница отмены checkout."
        : "Private checkout cancellation placeholder page."
  });
}

export default async function CheckoutCancelPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <PageHero
      accent={locale === "ru" ? "Checkout placeholder" : "Checkout placeholder"}
      title={locale === "ru" ? "Checkout отменен" : "Checkout cancelled"}
      description={
        locale === "ru"
          ? "Оплата пока не подключена. Эта страница подготовлена для будущего платежного сценария и не означает реальную отмену платежа."
          : "Payments are not connected yet. This page is prepared for a future payment flow and does not represent a real payment cancellation."
      }
    />
  );
}
