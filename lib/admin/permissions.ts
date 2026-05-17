import "server-only";

import { UserRole } from "@prisma/client";

export type AdminSection =
  | "dashboard"
  | "servers"
  | "products"
  | "coupons"
  | "sales"
  | "staticPages"
  | "media"
  | "paymentSystems"
  | "paymentNotifications"
  | "orders"
  | "payments"
  | "bans"
  | "faq"
  | "rules"
  | "moneyRace"
  | "support"
  | "delivery"
  | "auditLog";

export function isAdminRole(role: UserRole) {
  return role === UserRole.ADMIN || role === UserRole.OWNER;
}

export function canAccessAdminSection(role: UserRole, section: AdminSection) {
  if (isAdminRole(role)) {
    return true;
  }

  if (role === UserRole.MODERATOR) {
    return section === "bans" || section === "support";
  }

  return false;
}
