import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatCurrency, formatNumber, getLocalizedValue } from "@/lib/localized";

describe("localized helpers", () => {
  it("returns locale-specific values", () => {
    assert.equal(getLocalizedValue({ ru: "Серверы", en: "Servers" }, "en"), "Servers");
  });

  it("formats currency and numbers", () => {
    assert.match(formatCurrency(1200, "RUB", "ru"), /1/);
    assert.match(formatCurrency(20, "EUR", "en"), /€/);
    assert.equal(formatNumber(1200, "en"), "1,200");
  });
});
