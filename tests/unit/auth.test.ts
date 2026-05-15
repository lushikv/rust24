import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSafeLocale, getSafeReturnPath } from "@/lib/auth/redirects";

describe("auth redirect helpers", () => {
  it("normalizes unsupported locales", () => {
    assert.equal(getSafeLocale("en"), "en");
    assert.equal(getSafeLocale("de"), "ru");
  });

  it("allows internal return paths only", () => {
    assert.equal(getSafeReturnPath("/en/store?x=1", "ru"), "/en/store?x=1");
    assert.equal(getSafeReturnPath("https://evil.example", "ru"), "/ru/profile");
    assert.equal(getSafeReturnPath("//evil.example/path", "en"), "/en/profile");
  });
});
