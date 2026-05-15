import "server-only";

import type { Currency, Locale } from "@/types/content";

export type CartLineItem = {
  id: string;
  productSlug: string;
  categorySlug: string;
  title: string;
  quantity: number;
  unitPriceRub: number;
  unitPriceEur: number | null;
  totalRub: number;
  totalEur: number | null;
};

export type CartSummary = {
  totalQuantity: number;
  subtotalRub: number;
  subtotalEur: number | null;
};

export type CartDto = {
  id: string | null;
  currency: Currency;
  items: CartLineItem[];
  summary: CartSummary;
  unavailable?: boolean;
  message?: string;
};

export type CartIdentity = {
  userId?: string | null;
  sessionId?: string | null;
};

export type CartLocaleOptions = CartIdentity & {
  locale: Locale;
};
