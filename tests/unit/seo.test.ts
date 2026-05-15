import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createDynamicPageMetadata,
  getCanonicalUrl,
  getLanguageAlternates,
  getLocalizedPath
} from "@/lib/seo";

describe("SEO helpers", () => {
  it("builds localized paths", () => {
    assert.equal(getLocalizedPath("ru", "/"), "/ru");
    assert.equal(getLocalizedPath("en", "servers"), "/en/servers");
    assert.equal(getLocalizedPath("ru", "/store/passes"), "/ru/store/passes");
  });

  it("builds canonical URLs", () => {
    assert.equal(getCanonicalUrl("ru", "/servers"), "http://localhost:3000/ru/servers");
  });

  it("builds ru, en, and x-default alternates", () => {
    assert.deepEqual(getLanguageAlternates("/store"), {
      ru: "http://localhost:3000/ru/store",
      en: "http://localhost:3000/en/store",
      "x-default": "http://localhost:3000/ru/store"
    });
  });

  it("creates noindex metadata through the dynamic helper", () => {
    const metadata = createDynamicPageMetadata({
      locale: "ru",
      path: "/cart",
      title: "Cart",
      description: "Private cart page",
      index: false
    });

    assert.deepEqual(metadata.robots, { index: false, follow: false });
  });
});
