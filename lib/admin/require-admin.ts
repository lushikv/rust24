import "server-only";

import { getCurrentUser } from "@/lib/auth/current-user";
import {
  canAccessAdminSection,
  isAdminRole,
  type AdminSection
} from "@/lib/admin/permissions";
import type { AuthUser } from "@/lib/auth/types";

export type AdminAccessResult =
  | { status: "allowed"; user: AuthUser }
  | { status: "unauthenticated"; user: null }
  | { status: "forbidden"; user: AuthUser };

export async function getAdminAccess(section: AdminSection = "dashboard"): Promise<AdminAccessResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { status: "unauthenticated", user: null };
  }

  if (section === "dashboard" ? isAdminRole(user.role) : canAccessAdminSection(user.role, section)) {
    return { status: "allowed", user };
  }

  return { status: "forbidden", user };
}
