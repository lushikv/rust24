import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateCartSummary, calculateLineTotals, clampQuantity } from "@/lib/cart/cart-calculations";

describe("cart calculations", () => {
  it("clamps valid integer quantities", () => {
    assert.equal(clampQuantity(0), 1);
    assert.equal(clampQuantity(3), 3);
    assert.equal(clampQuantity(120), 99);
    assert.equal(clampQuantity(1.5), null);
  });

  it("calculates line totals", () => {
    assert.deepEqual(calculateLineTotals({ quantity: 2, unitPriceRub: 500, unitPriceEur: 6 }), {
      totalRub: 1000,
      totalEur: 12
    });
  });

  it("calculates cart summaries", () => {
    assert.deepEqual(
      calculateCartSummary([
        { id: "a", productSlug: "starter", categorySlug: "passes", title: "Starter", quantity: 2, unitPriceRub: 500, unitPriceEur: 6, totalRub: 1000, totalEur: 12 },
        { id: "b", productSlug: "kit", categorySlug: "kits", title: "Kit", quantity: 1, unitPriceRub: 300, unitPriceEur: 4, totalRub: 300, totalEur: 4 }
      ])
    , { totalQuantity: 3, subtotalRub: 1300, subtotalEur: 16 });
  });
});
