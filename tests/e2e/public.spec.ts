import { expect, test } from "@playwright/test";

test("localized public pages and protected shells load", async ({ page, request }) => {
  await page.goto("/ru");
  await expect(page.getByRole("link", { name: "RUST24" })).toBeVisible();

  await page.goto("/en");
  await expect(page.getByRole("link", { name: "RUST24" })).toBeVisible();

  await page.goto("/ru/servers");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("body")).toContainText(/online|онлайн/i);

  await page.goto("/ru/store");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('a[href="/ru/store/passes"]').first()).toBeVisible();

  await page.goto("/ru/store/passes/starter-pass");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("body")).toContainText(/₽|RUB/);
  await expect(page.locator("body")).toContainText(/Добавить в корзину|Войти через Steam|Add to cart|Login with Steam/i);

  await page.goto("/ru/faq");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/ru/profile");
  await expect(page.locator("body")).toContainText(/Steam|войти|login/i);

  await page.goto("/admin");
  await expect(page.locator("body")).toContainText(/Authentication|Forbidden|Steam|войти|login/i);

  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/api/public/servers/status")).status()).toBe(200);
});
