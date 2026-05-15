import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createProductJsonLd } from "@/lib/structured-data";
import type { StoreProductDetail } from "@/types/content";

const product: StoreProductDetail = {
  id: "starter-pass",
  slug: "starter-pass",
  categoryId: "passes",
  categorySlug: "passes",
  title: { ru: "Стартовый пропуск", en: "Starter Pass" },
  description: { ru: "Базовый набор преимуществ.", en: "A starter set of perks." },
  shortDescription: { ru: "Старт", en: "Starter" },
  category: {
    id: "passes",
    slug: "passes",
    title: { ru: "Пропуска", en: "Passes" },
    description: { ru: "Категория", en: "Category" }
  },
  price: { RUB: 490, EUR: 5 },
  discountPercent: undefined,
  duration: { ru: "30 дней", en: "30 days" },
  restrictions: { ru: "Все режимы", en: "All modes" },
  durationDays: 30,
  includedItems: [{ ru: "Доступ", en: "Access" }],
  modeRestrictions: [{ ru: "Все режимы", en: "All modes" }],
  priceRub: 490,
  priceEur: 5,
  oldPriceRub: undefined,
  oldPriceEur: undefined,
  type: "PRIVILEGE",
  status: "ACTIVE",
  imageUrl: null,
  featured: true,
  isFeatured: true
};

describe("structured data helpers", () => {
  it("creates truthful Product JSON-LD without fake ratings", () => {
    const jsonLd = createProductJsonLd(product, "en", "RUB");

    assert.equal(jsonLd["@type"], "Product");
    assert.equal(jsonLd.name, "Starter Pass");
    assert.equal(jsonLd.sku, "starter-pass");
    assert.equal((jsonLd.offers as Record<string, unknown>).price, 490);
    assert.equal((jsonLd.offers as Record<string, unknown>).priceCurrency, "RUB");
    assert.equal("aggregateRating" in jsonLd, false);
    assert.equal("review" in jsonLd, false);
  });
});
