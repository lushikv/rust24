-- Admin v2.6: payment provider settings and Telegram notification settings.

CREATE TABLE "PaymentSystemSetting" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT false,
  "publicConfig" JSONB,
  "secretConfigEncrypted" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PaymentSystemSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentNotificationSetting" (
  "id" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT false,
  "botTokenEncrypted" TEXT,
  "chatId" TEXT,
  "messageTemplate" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PaymentNotificationSetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaymentSystemSetting_provider_key" ON "PaymentSystemSetting"("provider");
CREATE INDEX "PaymentSystemSetting_provider_idx" ON "PaymentSystemSetting"("provider");
CREATE INDEX "PaymentSystemSetting_isEnabled_idx" ON "PaymentSystemSetting"("isEnabled");

CREATE UNIQUE INDEX "PaymentNotificationSetting_channel_key" ON "PaymentNotificationSetting"("channel");
CREATE INDEX "PaymentNotificationSetting_channel_idx" ON "PaymentNotificationSetting"("channel");
CREATE INDEX "PaymentNotificationSetting_isEnabled_idx" ON "PaymentNotificationSetting"("isEnabled");
