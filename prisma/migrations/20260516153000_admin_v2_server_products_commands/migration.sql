-- CreateTable
CREATE TABLE "ProductServer" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCommandTemplate" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "serverId" TEXT,
    "commandTemplate" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCommandTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductServer_productId_idx" ON "ProductServer"("productId");

-- CreateIndex
CREATE INDEX "ProductServer_serverId_idx" ON "ProductServer"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductServer_productId_serverId_key" ON "ProductServer"("productId", "serverId");

-- CreateIndex
CREATE INDEX "ProductCommandTemplate_productId_idx" ON "ProductCommandTemplate"("productId");

-- CreateIndex
CREATE INDEX "ProductCommandTemplate_serverId_idx" ON "ProductCommandTemplate"("serverId");

-- CreateIndex
CREATE INDEX "ProductCommandTemplate_isActive_idx" ON "ProductCommandTemplate"("isActive");

-- AddForeignKey
ALTER TABLE "ProductServer" ADD CONSTRAINT "ProductServer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductServer" ADD CONSTRAINT "ProductServer_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCommandTemplate" ADD CONSTRAINT "ProductCommandTemplate_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCommandTemplate" ADD CONSTRAINT "ProductCommandTemplate_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
