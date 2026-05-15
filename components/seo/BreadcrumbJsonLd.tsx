import type { Locale } from "@/config/locales";
import type { RouteKey } from "@/config/routes";
import { JsonLd } from "@/components/seo/JsonLd";
import { createBreadcrumbItems } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/structured-data";

export async function BreadcrumbJsonLd({
  locale,
  routeKey
}: {
  locale: Locale;
  routeKey: Exclude<RouteKey, "home">;
}) {
  const breadcrumbs = await createBreadcrumbItems(locale, routeKey);

  return <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} />;
}
