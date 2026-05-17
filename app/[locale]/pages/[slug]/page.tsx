import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import type { Locale } from "@/config/locales";
import { getLocalizedValue } from "@/lib/localized";
import { getPublishedStaticPage } from "@/lib/repositories/static-pages";
import { createDynamicPageMetadata, getCanonicalUrl } from "@/lib/seo";
import { createBreadcrumbJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return [] as Array<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPublishedStaticPage(slug);

  if (!page) {
    return createDynamicPageMetadata({
      locale,
      path: `/pages/${slug}`,
      title: locale === "ru" ? "Страница не найдена" : "Page not found",
      description:
        locale === "ru"
          ? "Запрошенная страница RUST24 не найдена."
          : "The requested RUST24 page was not found.",
      index: false
    });
  }

  return createDynamicPageMetadata({
    locale,
    path: `/pages/${page.slug}`,
    title: getLocalizedValue(page.title, locale),
    description: getLocalizedValue(page.description, locale),
    index: !page.noindex
  });
}

function renderPlainContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => (
      <p className="leading-8 text-zinc-300" key={block}>
        {block}
      </p>
    ));
}

export default async function StaticPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = await getPublishedStaticPage(slug);

  if (!page) {
    notFound();
  }

  const title = getLocalizedValue(page.title, locale);
  const breadcrumbs = [
    {
      label: locale === "ru" ? "Главная" : "Home",
      url: getCanonicalUrl(locale, "/")
    },
    {
      label: title,
      url: getCanonicalUrl(locale, `/pages/${page.slug}`)
    }
  ];

  return (
    <div className="w-full space-y-8">
      <PageHero
        title={title}
        description={getLocalizedValue(page.description, locale)}
        accent={locale === "ru" ? "ИНФОРМАЦИЯ" : "INFO"}
      />
      <article className="surface-card mx-auto max-w-4xl space-y-5 p-6">
        {renderPlainContent(getLocalizedValue(page.content, locale))}
      </article>
      {!page.noindex ? <JsonLd data={createBreadcrumbJsonLd(breadcrumbs)} /> : null}
    </div>
  );
}
