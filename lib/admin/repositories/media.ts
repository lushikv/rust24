import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminMediaFileRow = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  previewUrl: string | null;
  attachedToType: string | null;
  attachedToId: string | null;
  createdAt: string;
};

export async function getAdminMediaFiles() {
  return adminQuery(
    "media",
    async () => {
      const files = await prisma.mediaFile.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: 100
      });

      return files.map((file) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        url: file.url,
        previewUrl: file.previewUrl,
        attachedToType: file.attachedToType,
        attachedToId: file.attachedToId,
        createdAt: file.createdAt.toISOString()
      }));
    },
    [] as AdminMediaFileRow[]
  );
}
