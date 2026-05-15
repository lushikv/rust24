import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import type { Locale } from "@/config/locales";
import { JsonLd } from "@/components/seo/JsonLd";
import type { RouteKey } from "@/config/routes";
import { createBreadcrumbItems, createPageMetadata } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/structured-data";

export type PageKey = Exclude<RouteKey, "home">;

export function createPlaceholderMetadata(namespace: PageKey, locale: Locale) {
  return createPageMetadata(namespace, locale);
}

export function createPlaceholderPage(namespace: PageKey, _path?: string) {
  void _path;

  return {
    async generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
      const { locale } = await params;
      return createPlaceholderMetadata(namespace, locale);
    },
    async default({ params }: { params: Promise<{ locale: Locale }> }) {
      const { locale } = await params;
      return <PlaceholderPage locale={locale} namespace={namespace} />;
    }
  };
}

export async function PlaceholderPage({
  locale,
  namespace
}: {
  locale: Locale;
  namespace: PageKey;
}) {
  const t = await getTranslations(namespace);
  const breadcrumbs = await createBreadcrumbItems(locale, namespace);

  return (
    <>
      <PageShell title={t("title")} description={t("description")} />
      <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
