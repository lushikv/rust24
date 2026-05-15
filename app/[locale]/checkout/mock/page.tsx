import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { Locale } from "@/config/locales";
import { createNoIndexMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ paymentId?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createNoIndexMetadata({
    locale,
    path: "/checkout/mock",
    title: locale === "ru" ? "Mock checkout RUST24" : "RUST24 Mock Checkout",
    description:
      locale === "ru"
        ? "Dev-only mock checkout без реальной оплаты."
        : "Dev-only mock checkout without real payment."
  });
}

export default async function MockCheckoutPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { paymentId } = await searchParams;

  return (
    <div className="w-full space-y-6">
      <PageHero
        accent={locale === "ru" ? "Dev-only" : "Dev-only"}
        title="Mock checkout"
        description={
          locale === "ru"
            ? "Это dev-only страница mock-провайдера. Она не обрабатывает деньги и не может отметить заказ оплаченным."
            : "This is a dev-only mock provider page. It does not process money and cannot mark an order as paid."
        }
      />
      <SurfaceCard className="p-5 text-sm text-orange-100">
        Payment ID: <span className="font-black text-white">{paymentId ?? "missing"}</span>
      </SurfaceCard>
    </div>
  );
}
