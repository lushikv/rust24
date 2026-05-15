import "server-only";

import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminDashboardData = {
  stats: {
    totalUsers: number;
    activeServers: number;
    activeProducts: number;
    draftPendingOrders: number;
    activeBans: number;
  };
  paymentsByStatus: { status: PaymentStatus; count: number }[];
  latestAuditLogs: {
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    message: string | null;
    createdAt: string;
    user: string;
  }[];
  latestOrders: {
    id: string;
    status: string;
    totalRub: number;
    currency: string;
    createdAt: string;
    user: string;
  }[];
  dbStatus: "available" | "unavailable";
  redisStatus: "available" | "unconfigured" | "unavailable";
};

const emptyDashboard: AdminDashboardData = {
  stats: {
    totalUsers: 0,
    activeServers: 0,
    activeProducts: 0,
    draftPendingOrders: 0,
    activeBans: 0
  },
  paymentsByStatus: [],
  latestAuditLogs: [],
  latestOrders: [],
  dbStatus: "unavailable",
  redisStatus: "unconfigured"
};

async function getRedisStatus(): Promise<AdminDashboardData["redisStatus"]> {
  if (!isRedisConfigured()) {
    return "unconfigured";
  }

  const redis = getRedis();
  if (!redis) return "unconfigured";

  try {
    if (redis.status === "wait") {
      await redis.connect();
    }

    await redis.ping();
    return "available";
  } catch {
    return "unavailable";
  }
}

export async function getAdminDashboard() {
  return adminQuery(
    "dashboard",
    async () => {
      const [
        totalUsers,
        activeServers,
        activeProducts,
        draftPendingOrders,
        activeBans,
        paymentsByStatus,
        latestAuditLogs,
        latestOrders,
        redisStatus
      ] = await Promise.all([
        prisma.user.count(),
        prisma.server.count({ where: { isActive: true } }),
        prisma.product.count({ where: { status: "ACTIVE" } }),
        prisma.order.count({
          where: { status: { in: [OrderStatus.DRAFT, OrderStatus.PENDING_PAYMENT] } }
        }),
        prisma.banRecord.count({ where: { status: "ACTIVE" } }),
        prisma.payment.groupBy({
          by: ["status"],
          _count: { status: true },
          orderBy: { status: "asc" }
        }),
        prisma.auditLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { user: { include: { steamProfile: true } } }
        }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { user: { include: { steamProfile: true } } }
        }),
        getRedisStatus()
      ]);

      return {
        stats: {
          totalUsers,
          activeServers,
          activeProducts,
          draftPendingOrders,
          activeBans
        },
        paymentsByStatus: paymentsByStatus.map((item) => ({
          status: item.status,
          count: item._count.status
        })),
        latestAuditLogs: latestAuditLogs.map((log) => ({
          id: log.id,
          action: log.action,
          entityType: log.entityType,
          entityId: log.entityId,
          message: log.message,
          createdAt: log.createdAt.toISOString(),
          user: log.user?.displayName ?? log.user?.steamProfile?.personaName ?? "System"
        })),
        latestOrders: latestOrders.map((order) => ({
          id: order.id,
          status: order.status,
          totalRub: order.totalRub,
          currency: order.currency,
          createdAt: order.createdAt.toISOString(),
          user: order.user?.displayName ?? order.user?.steamProfile?.personaName ?? "Guest"
        })),
        dbStatus: "available",
        redisStatus
      } satisfies AdminDashboardData;
    },
    emptyDashboard
  );
}
