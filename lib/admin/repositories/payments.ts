import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminPaymentRow = {
  id: string;
  orderId: string;
  provider: string;
  status: string;
  amountRub: number;
  amountEur: number | null;
  currency: string;
  createdAt: string;
  attemptsCount: number;
  webhookEventsCount: number;
};

export async function getAdminPayments() {
  return adminQuery(
    "payments",
    async () => {
      const rows = await prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          attempts: true,
          webhookEvents: true
        }
      });

      return rows.map((payment) => ({
        id: payment.id,
        orderId: payment.orderId,
        provider: payment.provider,
        status: payment.status,
        amountRub: payment.amountRub,
        amountEur: payment.amountEur,
        currency: payment.currency,
        createdAt: payment.createdAt.toISOString(),
        attemptsCount: payment.attempts.length,
        webhookEventsCount: payment.webhookEvents.length
      }));
    },
    [] as AdminPaymentRow[]
  );
}
