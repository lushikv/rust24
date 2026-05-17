import assert from "node:assert/strict";
import test from "node:test";
import {
  findUnknownTelegramTemplateVariables,
  renderTelegramPaymentTemplate
} from "@/lib/notifications/telegram-template";

test("telegram payment template renders known variables and duration fallback", () => {
  const rendered = renderTelegramPaymentTemplate(
    "Игрок {playerName} купил {productName} на {durationDays} дней за {price} {currency}.",
    {
      playerName: "Player",
      steamId: "steam",
      productName: "Starter Pass",
      quantity: 1,
      durationDays: null,
      price: 390,
      currency: "RUB",
      serverName: "Forge Main",
      orderId: "order"
    }
  );

  assert.equal(rendered, "Игрок Player купил Starter Pass на без срока дней за 390 RUB.");
});

test("telegram payment template reports unknown variables", () => {
  assert.deepEqual(findUnknownTelegramTemplateVariables("Paid {productName} with {unknownValue}"), ["unknownValue"]);
});
