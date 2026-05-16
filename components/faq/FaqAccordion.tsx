"use client";

import { useState } from "react";
import type { FAQItem, Locale } from "@/types/content";
import { getLocalizedValue } from "@/lib/localized";

export function FaqAccordion({
  items,
  locale
}: {
  items: FAQItem[];
  locale: Locale;
}) {
  const [openId, setOpenId] = useState("");

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <section key={item.id} className="surface-card overflow-hidden">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? "" : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-black text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-300"
            >
              <span>{getLocalizedValue(item.question, locale)}</span>
              <span className="grid h-7 w-7 place-items-center rounded-sm border border-orange-300/25 bg-orange-400/10 text-orange-200">{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen ? (
              <p className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-zinc-300">
                {getLocalizedValue(item.answer, locale)}
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
