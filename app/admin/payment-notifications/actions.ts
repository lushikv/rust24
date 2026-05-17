"use server";

import { revalidatePath } from "next/cache";
import { AuditAction, UserRole } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { boolFromForm, optionalString, requiredString } from "@/lib/admin/validation";
import {
  defaultTelegramPaymentTemplate,
  findUnknownTelegramTemplateVariables
} from "@/lib/notifications/telegram-template";
import { encryptSecret } from "@/lib/security/encryption";
import { prisma } from "@/lib/prisma";

function requireOwner(user: { role: UserRole }) {
  if (user.role !== UserRole.OWNER) {
    throw new Error("Only OWNER can edit Telegram notification secrets.");
  }
}

const notificationSchema = z.object({
  isEnabled: z.boolean(),
  botToken: z.string().nullable(),
  chatId: z.string().nullable(),
  messageTemplate: z.string().min(1)
});

function parseNotificationForm(formData: FormData) {
  const messageTemplate = requiredString(formData.get("messageTemplate")) || defaultTelegramPaymentTemplate;
  const unknownVariables = findUnknownTelegramTemplateVariables(messageTemplate);

  if (unknownVariables.length > 0) {
    throw new Error(`Unknown Telegram template variables: ${unknownVariables.join(", ")}.`);
  }

  return notificationSchema.parse({
    isEnabled: boolFromForm(formData, "isEnabled"),
    botToken: optionalString(formData.get("botToken")),
    chatId: optionalString(formData.get("chatId")),
    messageTemplate
  });
}

export async function updatePaymentNotificationAction(formData: FormData) {
  const user = await requireAdminWrite("paymentNotifications", formData);
  requireOwner(user);
  const data = parseNotificationForm(formData);
  const existing = await prisma.paymentNotificationSetting.findUnique({
    where: { channel: "telegram" }
  });
  const encryptedToken = data.botToken ? encryptSecret(data.botToken) : undefined;

  if (data.isEnabled && !encryptedToken && !existing?.botTokenEncrypted) {
    throw new Error("Telegram bot token is required before enabling notifications.");
  }

  const setting = await prisma.paymentNotificationSetting.upsert({
    where: { channel: "telegram" },
    update: {
      isEnabled: data.isEnabled,
      chatId: data.chatId,
      messageTemplate: data.messageTemplate,
      ...(encryptedToken ? { botTokenEncrypted: encryptedToken } : {})
    },
    create: {
      channel: "telegram",
      isEnabled: data.isEnabled,
      chatId: data.chatId,
      messageTemplate: data.messageTemplate,
      botTokenEncrypted: encryptedToken
    }
  });

  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "PaymentNotificationSetting",
    entityId: setting.id,
    message: "Updated Telegram payment notification setting.",
    metadata: {
      channel: "telegram",
      isEnabled: setting.isEnabled,
      botTokenUpdated: Boolean(encryptedToken)
    }
  });

  revalidatePath("/admin/payment-notifications");
}
