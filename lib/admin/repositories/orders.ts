import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminOrderRow = {
  id: string;
  user: string;
  status: string;
  totalRub: number;
  totalEur: number | null;
  currency: string;
  createdAt: string;
  itemCount: number;
  deliveryJobCount: number;
};

export async function getAdminOrders() {
  return adminQuery(
    "orders",
    async () => {
      const rows = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          user: { include: { steamProfile: true } },
          items: true,
          deliveryJobs: true
        }
      });

      return rows.map((order) => ({
        id: order.id,
        user: order.user?.displayName ?? order.user?.steamProfile?.personaName ?? "Guest",
        status: order.status,
        totalRub: order.totalRub,
        totalEur: order.totalEur,
        currency: order.currency,
        createdAt: order.createdAt.toISOString(),
        itemCount: order.items.length,
        deliveryJobCount: order.deliveryJobs.length
      }));
    },
    [] as AdminOrderRow[]
  );
}
