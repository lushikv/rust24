import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { couponAdminSchema, saleAdminSchema } from "@/lib/admin/discount-validation";

describe("admin discount validation", () => {
  it("normalizes coupon codes and enforces unique-account discount limits", () => {
    const coupon = couponAdminSchema.parse({
      code: "launch-10",
      discountPercent: 10,
      usageLimit: 50,
      expiresAt: null,
      isActive: true,
      appliesToAllProducts: true,
      productIds: []
    });

    assert.equal(coupon.code, "LAUNCH-10");
    assert.equal(coupon.usageLimit, 50);
  });

  it("rejects invalid coupon discount ranges and empty product selection", () => {
    assert.throws(() =>
      couponAdminSchema.parse({
        code: "BAD",
        discountPercent: 0,
        usageLimit: null,
        expiresAt: null,
        isActive: true,
        appliesToAllProducts: false,
        productIds: []
      })
    );
  });

  it("rejects sale campaigns with invalid date ranges", () => {
    assert.throws(() =>
      saleAdminSchema.parse({
        title: "Invalid sale",
        discountPercent: 15,
        startsAt: new Date("2026-06-10T00:00:00.000Z"),
        endsAt: new Date("2026-06-01T00:00:00.000Z"),
        isActive: true,
        appliesToAllProducts: true,
        productIds: []
      })
    );
  });

  it("accepts selected-product sale campaigns", () => {
    const sale = saleAdminSchema.parse({
      title: "Wipe weekend",
      discountPercent: 20,
      startsAt: new Date("2026-06-01T00:00:00.000Z"),
      endsAt: new Date("2026-06-10T00:00:00.000Z"),
      isActive: true,
      appliesToAllProducts: false,
      productIds: ["product_1"]
    });

    assert.deepEqual(sale.productIds, ["product_1"]);
  });
});
