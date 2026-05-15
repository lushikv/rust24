import type { Product, ProductCategory } from "@/types/content";

export const productCategories: ProductCategory[] = [
  {
    id: "passes",
    title: { ru: "Пропуски", en: "Passes" },
    description: {
      ru: "Статичные примеры будущих серверных привилегий без оплаты и выдачи.",
      en: "Static examples of future server perks without payment or delivery logic."
    }
  },
  {
    id: "cosmetic",
    title: { ru: "Косметика", en: "Cosmetics" },
    description: {
      ru: "Идеи визуальных бонусов, которые не влияют на честный игровой баланс.",
      en: "Visual bonus ideas that do not affect fair gameplay balance."
    }
  },
  {
    id: "utility",
    title: { ru: "Удобство", en: "Utility" },
    description: {
      ru: "Будущие удобные функции с прозрачными ограничениями по режимам.",
      en: "Future convenience features with transparent mode restrictions."
    }
  }
];

export const products: Product[] = [
  {
    id: "starter-pass",
    categoryId: "passes",
    title: { ru: "Starter Pass", en: "Starter Pass" },
    description: {
      ru: "Макет стартового пропуска для будущей витрины RUST24.",
      en: "A starter pass mockup for the future RUST24 storefront."
    },
    price: { RUB: 390, EUR: 4 },
    duration: { ru: "7 дней", en: "7 days" },
    restrictions: { ru: "Демонстрационный товар", en: "Demonstration item" },
    featured: true
  },
  {
    id: "queue-token",
    categoryId: "utility",
    title: { ru: "Queue Token", en: "Queue Token" },
    description: {
      ru: "Демонстрационная карточка будущего приоритета очереди.",
      en: "A demonstration card for a future queue priority perk."
    },
    price: { RUB: 590, EUR: 6 },
    discountPercent: 15,
    duration: { ru: "14 дней", en: "14 days" },
    restrictions: { ru: "Только публичные серверы", en: "Public servers only" },
    featured: true
  },
  {
    id: "visual-pack",
    categoryId: "cosmetic",
    title: { ru: "Visual Pack", en: "Visual Pack" },
    description: {
      ru: "Косметический пример без влияния на урон, лут или защиту.",
      en: "A cosmetic example with no impact on damage, loot, or protection."
    },
    price: { RUB: 790, EUR: 8 },
    duration: { ru: "30 дней", en: "30 days" },
    restrictions: { ru: "Доступность зависит от режима", en: "Availability depends on mode" }
  }
];
