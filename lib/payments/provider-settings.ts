import "server-only";

export type PaymentProviderDefinition = {
  provider: string;
  displayName: string;
  publicFields: Array<{
    key: string;
    label: string;
    placeholder?: string;
  }>;
  secretFields: Array<{
    key: string;
    label: string;
  }>;
};

export const paymentProviderDefinitions = [
  {
    provider: "freekassa",
    displayName: "FreeKassa",
    publicFields: [{ key: "merchantId", label: "Merchant ID" }, { key: "testMode", label: "Test mode" }],
    secretFields: [{ key: "secretKey", label: "Secret key" }, { key: "webhookSecret", label: "Webhook secret" }]
  },
  {
    provider: "anypay",
    displayName: "AnyPay",
    publicFields: [{ key: "merchantId", label: "Merchant ID" }, { key: "testMode", label: "Test mode" }],
    secretFields: [{ key: "apiKey", label: "API key" }, { key: "secretKey", label: "Secret key" }]
  },
  {
    provider: "centapp",
    displayName: "Cent.app",
    publicFields: [{ key: "shopId", label: "Shop ID" }, { key: "testMode", label: "Test mode" }],
    secretFields: [{ key: "token", label: "Token" }, { key: "webhookSecret", label: "Webhook secret" }]
  },
  {
    provider: "payeer",
    displayName: "Payeer",
    publicFields: [{ key: "shopId", label: "Shop ID" }, { key: "testMode", label: "Test mode" }],
    secretFields: [{ key: "secretKey", label: "Secret key" }]
  },
  {
    provider: "unitpay",
    displayName: "UnitPay",
    publicFields: [{ key: "projectId", label: "Project ID" }, { key: "testMode", label: "Test mode" }],
    secretFields: [{ key: "secretKey", label: "Secret key" }]
  },
  {
    provider: "yookassa",
    displayName: "YooKassa",
    publicFields: [{ key: "shopId", label: "Shop ID" }, { key: "testMode", label: "Test mode" }],
    secretFields: [{ key: "secretKey", label: "Secret key" }, { key: "webhookSecret", label: "Webhook secret" }]
  },
  {
    provider: "yoomoney-p2p",
    displayName: "YooMoney P2P",
    publicFields: [{ key: "receiver", label: "Receiver wallet" }, { key: "testMode", label: "Test mode" }],
    secretFields: [{ key: "token", label: "Token" }]
  },
  {
    provider: "getpay",
    displayName: "GetPay",
    publicFields: [{ key: "shopId", label: "Shop ID" }, { key: "testMode", label: "Test mode" }],
    secretFields: [{ key: "secretKey", label: "Secret key" }, { key: "webhookSecret", label: "Webhook secret" }]
  }
] as const satisfies readonly PaymentProviderDefinition[];

export function getPaymentProviderDefinition(provider: string) {
  return paymentProviderDefinitions.find((item) => item.provider === provider) ?? null;
}
