import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import type { Locale } from "@/config/locales";
import { getUserAgreement } from "@/data/legal";
import { createBreadcrumbItems, createPageMetadata } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata("userAgreement", locale);
}

export default async function UserAgreementPage({ params }: PageProps) {
  const { locale } = await params;
  const document = getUserAgreement(locale);
  const breadcrumbs = await createBreadcrumbItems(locale, "userAgreement");

  return (
    <>
      <LegalDocumentView
        document={document}
        updatedLabel={locale === "ru" ? "Обновлено" : "Updated"}
      />
      <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
