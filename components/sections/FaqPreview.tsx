import Link from "next/link";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import type { FAQItem, Locale } from "@/types/content";

export function FaqPreview({
  locale,
  items
}: {
  locale: Locale;
  items: FAQItem[];
}) {
  return (
    <section className="py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="section-title">
          {locale === "ru" ? "Частые вопросы" : "Common questions"}
        </h2>
        <Link className="focus-ring rounded-md text-sm font-bold text-orange-300 hover:text-orange-100" href={`/${locale}/faq`}>
          FAQ
        </Link>
      </div>
      <FaqAccordion items={items.slice(0, 3)} locale={locale} />
    </section>
  );
}
