import assert from "node:assert/strict";
import { describe, it } from "node:test";
import robots from "@/app/robots";

describe("robots", () => {
  it("disallows admin, api, and localized private routes", () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    const disallow = rules.disallow;

    assert.ok(Array.isArray(disallow));
    assert.ok(disallow.includes("/admin"));
    assert.ok(disallow.includes("/api"));
    assert.ok(disallow.includes("/ru/profile"));
    assert.ok(disallow.includes("/en/profile"));
    assert.ok(disallow.includes("/ru/cart"));
    assert.ok(disallow.includes("/en/checkout"));
  });
});
