-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'RETRY_SCHEDULED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryTarget" AS ENUM ('STEAM_INVENTORY', 'GAME_SERVER', 'MANUAL');

-- CreateEnum
CREATE TYPE "DeliveryTrigger" AS ENUM ('PAYMENT_CONFIRMED', 'ADMIN_MANUAL', 'SYSTEM_RETRY');

-- CreateEnum
CREATE TYPE "DeliveryAttemptStatus" AS ENUM ('STARTED', 'SKIPPED', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "DeliveryJob" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderItemId" TEXT,
    "userId" TEXT,
    "productId" TEXT,
    "target" "DeliveryTarget" NOT NULL,
    "trigger" "DeliveryTrigger" NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "productSlug" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "steamId" TEXT,
    "serverSlug" TEXT,
    "commandPreview" TEXT,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "availableAfter" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryJobAttempt" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" "DeliveryAttemptStatus" NOT NULL,
    "message" TEXT,
    "commandPreview" TEXT,
    "errorCode" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "DeliveryJobAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeliveryJob_orderId_idx" ON "DeliveryJob"("orderId");

-- CreateIndex
CREATE INDEX "DeliveryJob_userId_idx" ON "DeliveryJob"("userId");

-- CreateIndex
CREATE INDEX "DeliveryJob_productId_idx" ON "DeliveryJob"("productId");

-- CreateIndex
CREATE INDEX "DeliveryJob_status_idx" ON "DeliveryJob"("status");

-- CreateIndex
CREATE INDEX "DeliveryJob_target_idx" ON "DeliveryJob"("target");

-- CreateIndex
CREATE INDEX "DeliveryJob_createdAt_idx" ON "DeliveryJob"("createdAt");

-- CreateIndex
CREATE INDEX "DeliveryJob_availableAfter_idx" ON "DeliveryJob"("availableAfter");

-- CreateIndex
CREATE INDEX "DeliveryJobAttempt_jobId_idx" ON "DeliveryJobAttempt"("jobId");

-- CreateIndex
CREATE INDEX "DeliveryJobAttempt_status_idx" ON "DeliveryJobAttempt"("status");

-- CreateIndex
CREATE INDEX "DeliveryJobAttempt_startedAt_idx" ON "DeliveryJobAttempt"("startedAt");

-- AddForeignKey
ALTER TABLE "DeliveryJob" ADD CONSTRAINT "DeliveryJob_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryJob" ADD CONSTRAINT "DeliveryJob_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryJob" ADD CONSTRAINT "DeliveryJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryJob" ADD CONSTRAINT "DeliveryJob_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryJobAttempt" ADD CONSTRAINT "DeliveryJobAttempt_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "DeliveryJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
