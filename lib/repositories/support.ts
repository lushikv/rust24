import "server-only";

import { supportChannels as fallbackSupportChannels } from "@/data/support";
import { prisma } from "@/lib/prisma";
import { tryDatabase } from "@/lib/repositories/repository-utils";
import type { SupportChannel } from "@/types/content";

export async function getSupportChannels(): Promise<SupportChannel[]> {
  return tryDatabase(
    async () => {
      const rows = await prisma.supportChannel.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      });

      return rows.map((channel) => ({
        id: channel.slug,
        title: { ru: channel.titleRu, en: channel.titleEn },
        description: {
          ru: channel.descriptionRu,
          en: channel.descriptionEn
        },
        responseTime: { ru: "по расписанию", en: "on schedule" },
        href: channel.url
      }));
    },
    fallbackSupportChannels,
    "getSupportChannels"
  );
}
