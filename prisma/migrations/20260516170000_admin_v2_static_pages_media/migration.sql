-- Admin v2.5: static pages and media registry.

CREATE TABLE "StaticPage" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "titleRu" TEXT NOT NULL,
  "titleEn" TEXT NOT NULL,
  "descriptionRu" TEXT,
  "descriptionEn" TEXT,
  "contentRu" TEXT NOT NULL,
  "contentEn" TEXT NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "noindex" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "StaticPage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaFile" (
  "id" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "previewUrl" TEXT,
  "attachedToType" TEXT,
  "attachedToId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StaticPage_slug_key" ON "StaticPage"("slug");
CREATE INDEX "StaticPage_slug_idx" ON "StaticPage"("slug");
CREATE INDEX "StaticPage_isPublished_idx" ON "StaticPage"("isPublished");
CREATE INDEX "StaticPage_noindex_idx" ON "StaticPage"("noindex");

CREATE INDEX "MediaFile_filename_idx" ON "MediaFile"("filename");
CREATE INDEX "MediaFile_mimeType_idx" ON "MediaFile"("mimeType");
CREATE INDEX "MediaFile_attachedToType_attachedToId_idx" ON "MediaFile"("attachedToType", "attachedToId");
CREATE INDEX "MediaFile_createdAt_idx" ON "MediaFile"("createdAt");
