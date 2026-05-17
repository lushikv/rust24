import "server-only";

import type { Prisma } from "@prisma/client";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";
import { prisma } from "@/lib/prisma";
import { paymentProviderDefinitions } from "@/lib/payments/provider-settings";
import {
  defaultTelegramPaymentTemplate,
  renderTelegramPaymentTemplate,
  sampleTelegramPaymentTemplateData
} from "@/lib/notifications/telegram-template";

export type AdminPaymentSystemRow = {
  provider: string;
  displayName: string;
  isEnabled: boolean;
  configured: boolean;
  publicConfig: Record<string, string | boolean>;
  updatedAt: string | null;
};

export type AdminPaymentSystemFormData = {
  provider: string;
  displayName: string;
  isEnabled: boolean;
  configured: boolean;
  publicConfig: Record<string, string | boolean>;
};

function normalizePublicConfig(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, string | boolean>;
  }

  const result: Record<string, string | boolean> = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string" || typeof item === "boolean") {
      result[key] = item;
    }
  }

  return result;
}

export async function getAdminPaymentSystems() {
  return adminQuery(
    "payment-systems",
    async () => {
      const settings = await prisma.paymentSystemSetting.findMany();
      const byProvider = new Map(settings.map((setting) => [setting.provider, setting]));

      return paymentProviderDefinitions.map((definition) => {
        const setting = byProvider.get(definition.provider);
        return {
          provider: definition.provider,
          displayName: setting?.displayName ?? definition.displayName,
          isEnabled: setting?.isEnabled ?? false,
          configured: Boolean(setting?.secretConfigEncrypted),
          publicConfig: normalizePublicConfig(setting?.publicConfig),
          updatedAt: setting?.updatedAt.toISOString() ?? null
        };
      });
    },
    paymentProviderDefinitions.map((definition) => ({
      provider: definition.provider,
      displayName: definition.displayName,
      isEnabled: false,
      configured: false,
      publicConfig: {},
      updatedAt: null
    })) as AdminPaymentSystemRow[]
  );
}

export async function getAdminPaymentSystemFormData(provider: string) {
  return adminQuery(
    "payment-system-form",
    async () => {
      const setting = await prisma.paymentSystemSetting.findUnique({
        where: { provider }
      });

      return {
        provider,
        displayName: setting?.displayName ?? "",
        isEnabled: setting?.isEnabled ?? false,
        configured: Boolean(setting?.secretConfigEncrypted),
        publicConfig: normalizePublicConfig(setting?.publicConfig)
      };
    },
    {
      provider,
      displayName: "",
      isEnabled: false,
      configured: false,
      publicConfig: {}
    } satisfies AdminPaymentSystemFormData
  );
}

export type AdminPaymentNotificationData = {
  isEnabled: boolean;
  configured: boolean;
  chatId: string | null;
  messageTemplate: string;
  preview: string;
  updatedAt: string | null;
};

export async function getAdminPaymentNotificationSetting() {
  return adminQuery(
    "payment-notifications",
    async () => {
      const setting = await prisma.paymentNotificationSetting.findUnique({
        where: { channel: "telegram" }
      });
      const template = setting?.messageTemplate ?? defaultTelegramPaymentTemplate;

      return {
        isEnabled: setting?.isEnabled ?? false,
        configured: Boolean(setting?.botTokenEncrypted),
        chatId: setting?.chatId ?? null,
        messageTemplate: template,
        preview: renderTelegramPaymentTemplate(template, sampleTelegramPaymentTemplateData),
        updatedAt: setting?.updatedAt.toISOString() ?? null
      };
    },
    {
      isEnabled: false,
      configured: false,
      chatId: null,
      messageTemplate: defaultTelegramPaymentTemplate,
      preview: renderTelegramPaymentTemplate(defaultTelegramPaymentTemplate, sampleTelegramPaymentTemplateData),
      updatedAt: null
    } satisfies AdminPaymentNotificationData
  );
}
