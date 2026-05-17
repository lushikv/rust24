ALTER TABLE "Server"
ADD COLUMN "publicAddress" TEXT,
ADD COLUMN "rconHost" TEXT,
ADD COLUMN "rconPort" INTEGER,
ADD COLUMN "rconPasswordEncrypted" TEXT,
ADD COLUMN "rconEnabled" BOOLEAN NOT NULL DEFAULT false;
