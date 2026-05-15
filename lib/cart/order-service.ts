import "server-only";

import { prisma } from "@/lib/prisma";

export type ProfileOrder = {
  id: string;
  status: string;
  totalRub: number;
  totalEur: number | null;
  createdAt: string;
  itemCount: number;
  paymentStatus: string | null;
  paymentProvider: string | null;
};

export async function getProfileOrders(userId: string): Promise<ProfileOrder[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        items: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalRub: order.totalRub,
      totalEur: order.totalEur,
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      paymentStatus: order.payments[0]?.status ?? null,
      paymentProvider: order.payments[0]?.provider ?? null
    }));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[orders] read failed: ${message}; returning empty order list.`);
    }

    return [];
  }
}
