import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";
import { getDeliveryJobById } from "@/lib/delivery/delivery-service";
import type { DeliveryJobDTO } from "@/lib/delivery/types";

export type AdminDeliveryJobRow = {
  id: string;
  orderId: string;
  user: string;
  steamId: string | null;
  target: string;
  trigger: string;
  status: string;
  productTitle: string;
  productSlug: string;
  quantity: number;
  createdAt: string;
  availableAfter: string | null;
  latestAttempt: string | null;
};

export async function getAdminDeliveryJobs() {
  return adminQuery(
    "delivery",
    async () => {
      const rows = await prisma.deliveryJob.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          user: { include: { steamProfile: true } },
          attempts: { orderBy: { startedAt: "desc" }, take: 1 }
        }
      });

      return rows.map((job) => ({
        id: job.id,
        orderId: job.orderId,
        user: job.user?.displayName ?? job.user?.steamProfile?.personaName ?? "Unknown",
        steamId: job.steamId,
        target: job.target,
        trigger: job.trigger,
        status: job.status,
        productTitle: job.productTitle,
        productSlug: job.productSlug,
        quantity: job.quantity,
        createdAt: job.createdAt.toISOString(),
        availableAfter: job.availableAfter?.toISOString() ?? null,
        latestAttempt: job.attempts[0]?.status ?? null
      }));
    },
    [] as AdminDeliveryJobRow[]
  );
}

export async function getAdminDeliveryJob(jobId: string) {
  return adminQuery<DeliveryJobDTO | null>(
    "delivery-detail",
    () => getDeliveryJobById(jobId),
    null
  );
}
