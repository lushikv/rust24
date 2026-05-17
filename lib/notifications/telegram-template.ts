export const defaultTelegramPaymentTemplate =
  "Игрок {playerName} купил {productName} на {durationDays} дней за {price} {currency}.";

export const telegramPaymentTemplateVariables = [
  "playerName",
  "steamId",
  "productName",
  "quantity",
  "durationDays",
  "price",
  "currency",
  "serverName",
  "orderId"
] as const;

export type TelegramPaymentTemplateVariable = (typeof telegramPaymentTemplateVariables)[number];

export type TelegramPaymentTemplateData = Record<TelegramPaymentTemplateVariable, string | number | null | undefined>;

export const sampleTelegramPaymentTemplateData: TelegramPaymentTemplateData = {
  playerName: "G13/MaShalaH",
  steamId: "76561198030452759",
  productName: "Starter Pass",
  quantity: 1,
  durationDays: 7,
  price: 390,
  currency: "RUB",
  serverName: "Forge Main",
  orderId: "order_demo"
};

export function renderTelegramPaymentTemplate(template: string, data: TelegramPaymentTemplateData) {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, rawKey: string) => {
    if (!telegramPaymentTemplateVariables.includes(rawKey as TelegramPaymentTemplateVariable)) {
      return match;
    }

    const value = data[rawKey as TelegramPaymentTemplateVariable];
    if (value === null || value === undefined || value === "") {
      return rawKey === "durationDays" ? "без срока" : "-";
    }

    return String(value);
  });
}

export function findUnknownTelegramTemplateVariables(template: string) {
  const matches = template.matchAll(/\{([a-zA-Z0-9_]+)\}/g);
  const unknown = new Set<string>();

  for (const match of matches) {
    const key = match[1];
    if (!telegramPaymentTemplateVariables.includes(key as TelegramPaymentTemplateVariable)) {
      unknown.add(key);
    }
  }

  return Array.from(unknown);
}
