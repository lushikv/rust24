import "server-only";

import type { AdminPopularProductView } from "@/components/admin/AdminPopularProductCard";
import type { AdminRevenueChartPoint } from "@/components/admin/AdminRevenueChart";
import { adminQuery } from "@/lib/admin/repositories/admin-repository-utils";

export type AdminAnalyticsData = {
  revenueLast24HoursRub: number;
  monthlyProfit: AdminRevenueChartPoint[];
  popularProductOverall: AdminPopularProductView;
  popularProductThisMonth: AdminPopularProductView;
  popularProductToday: AdminPopularProductView;
  revenueAnalyticsAvailable: boolean;
  emptyReason: string;
};

function getLastTwelveMonths(): AdminRevenueChartPoint[] {
  const now = new Date();

  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + index, 1));

    return {
      month: new Intl.DateTimeFormat("en", { month: "short" }).format(date),
      revenueRub: 0
    };
  });
}

const emptyReason = "Revenue analytics will be available after real payment provider integration.";

const emptyAnalytics: AdminAnalyticsData = {
  revenueLast24HoursRub: 0,
  monthlyProfit: getLastTwelveMonths(),
  popularProductOverall: null,
  popularProductThisMonth: null,
  popularProductToday: null,
  revenueAnalyticsAvailable: false,
  emptyReason
};

export async function getAdminAnalytics() {
  return adminQuery(
    "analytics",
    async () => emptyAnalytics,
    emptyAnalytics
  );
}
