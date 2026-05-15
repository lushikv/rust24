import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminSupportRow = {
  id: string;
  slug: string;
  title: string;
  url: string;
  isActive: boolean;
};

export async function getAdminSupportChannels() {
  return adminQuery(
    "support",
    async () => {
      const rows = await prisma.supportChannel.findMany({
        orderBy: { sortOrder: "asc" }
      });

      return rows.map((channel) => ({
        id: channel.id,
        slug: channel.slug,
        title: channel.titleEn,
        url: channel.url,
        isActive: channel.isActive
      }));
    },
    [] as AdminSupportRow[]
  );
}
