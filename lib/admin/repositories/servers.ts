import "server-only";

import { prisma } from "@/lib/prisma";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminServerRow = {
  id: string;
  sortOrder: number;
  title: string;
  slug: string;
  publicAddress: string;
  address: string;
  connectCommand: string;
  mode: string;
  region: string;
  teamLimit: string;
  isActive: boolean;
  isFeatured: boolean;
  rconConfigured: boolean;
  latestStatus: string;
};

export type AdminServerDetail = AdminServerRow & {
  titleRu: string;
  titleEn: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
  capacity: number;
  wipeScheduleRu: string;
  wipeScheduleEn: string;
  rconEnabled: boolean;
  rconHost: string | null;
  rconPort: number | null;
  earningsTotalRub: number | null;
  earningsLast24HoursRub: number | null;
  paymentHistory: Array<{
    id: string;
    status: string;
    provider: string;
    amountRub: number;
    createdAt: string;
  }>;
  productsAssigned: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
  }>;
  latestDeliveryJobs: Array<{
    id: string;
    status: string;
    productTitle: string;
    quantity: number;
    createdAt: string;
  }>;
};

function mapServerRow(server: {
  id: string;
  sortOrder: number;
  titleEn: string;
  slug: string;
  publicAddress: string | null;
  address: string;
  connectCommand: string;
  mode: string;
  region: string;
  teamLimit: string;
  isActive: boolean;
  isFeatured: boolean;
  rconEnabled: boolean;
  rconHost: string | null;
  rconPort: number | null;
  statusSnapshots: Array<{ status: string }>;
}): AdminServerRow {
  return {
    id: server.id,
    sortOrder: server.sortOrder,
    title: server.titleEn,
    slug: server.slug,
    publicAddress: server.publicAddress ?? server.address,
    address: server.address,
    connectCommand: server.connectCommand,
    mode: server.mode,
    region: server.region,
    teamLimit: server.teamLimit,
    isActive: server.isActive,
    isFeatured: server.isFeatured,
    rconConfigured: server.rconEnabled && Boolean(server.rconHost && server.rconPort),
    latestStatus: server.statusSnapshots[0]?.status ?? "NO_SNAPSHOT"
  };
}

export async function getAdminServers() {
  return adminQuery(
    "servers",
    async () => {
      const rows = await prisma.server.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
          statusSnapshots: {
            orderBy: { capturedAt: "desc" },
            take: 1
          }
        }
      });

      return rows.map(mapServerRow);
    },
    [] as AdminServerRow[]
  );
}

export async function getAdminServerDetail(serverId: string) {
  return adminQuery<AdminServerDetail | null>(
    "server-detail",
    async () => {
      const server = await prisma.server.findUnique({
        where: { id: serverId },
        include: {
          statusSnapshots: { orderBy: { capturedAt: "desc" }, take: 1 },
          productServers: {
            include: {
              product: {
                include: {
                  translations: { where: { locale: "EN" }, take: 1 }
                }
              }
            }
          }
        }
      });

      if (!server) return null;

      const latestDeliveryJobs = await prisma.deliveryJob.findMany({
        where: { serverSlug: server.slug },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          productTitle: true,
          quantity: true,
          createdAt: true
        }
      });

      return {
        ...mapServerRow(server),
        titleRu: server.titleRu,
        titleEn: server.titleEn,
        descriptionRu: server.descriptionRu,
        descriptionEn: server.descriptionEn,
        capacity: server.capacity,
        wipeScheduleRu: server.wipeScheduleRu,
        wipeScheduleEn: server.wipeScheduleEn,
        rconEnabled: server.rconEnabled,
        rconHost: server.rconHost,
        rconPort: server.rconPort,
        earningsTotalRub: null,
        earningsLast24HoursRub: null,
        paymentHistory: [],
        productsAssigned: server.productServers.map(({ product }) => ({
          id: product.id,
          title: product.translations[0]?.title ?? product.slug,
          slug: product.slug,
          status: product.status
        })),
        latestDeliveryJobs: latestDeliveryJobs.map((job) => ({
          id: job.id,
          status: job.status,
          productTitle: job.productTitle,
          quantity: job.quantity,
          createdAt: job.createdAt.toISOString()
        }))
      };
    },
    null
  );
}
