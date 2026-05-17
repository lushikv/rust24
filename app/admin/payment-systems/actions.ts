"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction, UserRole } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { boolFromForm, optionalString, requiredString } from "@/lib/admin/validation";
import { encryptSecret } from "@/lib/security/encryption";
import { getPaymentProviderDefinition } from "@/lib/payments/provider-settings";
import { prisma } from "@/lib/prisma";

function requireOwner(user: { role: UserRole }) {
  if (user.role !== UserRole.OWNER) {
    throw new Error("Only OWNER can edit payment provider secrets.");
  }
}

const paymentSystemSchema = z.object({
  provider: z.string().min(1),
  displayName: z.string().min(1),
  isEnabled: z.boolean(),
  publicConfig: z.record(z.string(), z.union([z.string(), z.boolean()])),
  secretConfig: z.record(z.string(), z.string()).nullable()
});

function parsePaymentSystemForm(provider: string, formData: FormData) {
  const definition = getPaymentProviderDefinition(provider);
  if (!definition) {
    throw new Error("Unknown payment provider.");
  }

  const publicConfig: Record<string, string | boolean> = {};
  for (const field of definition.publicFields) {
    if (field.key === "testMode") {
      publicConfig[field.key] = boolFromForm(formData, field.key);
    } else {
      publicConfig[field.key] = optionalString(formData.get(field.key)) ?? "";
    }
  }

  const secretConfig: Record<string, string> = {};
  for (const field of definition.secretFields) {
    const value = optionalString(formData.get(`secret_${field.key}`));
    if (value) {
      secretConfig[field.key] = value;
    }
  }

  return paymentSystemSchema.parse({
    provider,
    displayName: requiredString(formData.get("displayName")) || definition.displayName,
    isEnabled: boolFromForm(formData, "isEnabled"),
    publicConfig,
    secretConfig: Object.keys(secretConfig).length > 0 ? secretConfig : null
  });
}

export async function updatePaymentSystemAction(provider: string, formData: FormData) {
  const user = await requireAdminWrite("paymentSystems", formData);
  requireOwner(user);
  const definition = getPaymentProviderDefinition(provider);
  if (!definition) {
    throw new Error("Unknown payment provider.");
  }

  const data = parsePaymentSystemForm(provider, formData);
  const existing = await prisma.paymentSystemSetting.findUnique({
    where: { provider }
  });
  const encrypted = data.secretConfig ? encryptSecret(JSON.stringify(data.secretConfig)) : undefined;

  if (data.isEnabled && !encrypted && !existing?.secretConfigEncrypted) {
    throw new Error("Secret settings are required before enabling this payment provider.");
  }

  const setting = await prisma.paymentSystemSetting.upsert({
    where: { provider },
    update: {
      displayName: data.displayName,
      isEnabled: data.isEnabled,
      publicConfig: data.publicConfig,
      ...(encrypted ? { secretConfigEncrypted: encrypted } : {})
    },
    create: {
      provider,
      displayName: data.displayName,
      isEnabled: data.isEnabled,
      publicConfig: data.publicConfig,
      secretConfigEncrypted: encrypted
    }
  });

  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "PaymentSystemSetting",
    entityId: setting.id,
    message: "Updated payment system setting.",
    metadata: {
      provider,
      displayName: setting.displayName,
      isEnabled: setting.isEnabled,
      secretUpdated: Boolean(encrypted)
    }
  });

  revalidatePath("/admin/payment-systems");
  redirect("/admin/payment-systems");
}
