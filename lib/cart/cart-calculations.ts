import "server-only";

import type { CartLineItem, CartSummary } from "@/lib/cart/types";

export function clampQuantity(quantity: number) {
  if (!Number.isInteger(quantity)) {
    return null;
  }

  return Math.min(99, Math.max(1, quantity));
}

export function calculateLineTotals({
  quantity,
  unitPriceRub,
  unitPriceEur
}: {
  quantity: number;
  unitPriceRub: number;
  unitPriceEur: number | null;
}) {
  return {
    totalRub: unitPriceRub * quantity,
    totalEur: unitPriceEur === null ? null : unitPriceEur * quantity
  };
}

export function calculateCartSummary(items: CartLineItem[]): CartSummary {
  const subtotalEur = items.some((item) => item.totalEur === null)
    ? null
    : items.reduce((sum, item) => sum + (item.totalEur ?? 0), 0);

  return {
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalRub: items.reduce((sum, item) => sum + item.totalRub, 0),
    subtotalEur
  };
}
