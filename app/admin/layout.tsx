import type { ReactNode } from "react";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminShell } from "@/components/admin/AdminShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";

export const metadata = createAdminMetadata("Admin");

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    return (
      <html lang="ru">
        <body>
          <AdminForbidden type="login" />
        </body>
      </html>
    );
  }

  if (access.status === "forbidden") {
    return (
      <html lang="ru">
        <body>
          <AdminForbidden type="forbidden" />
        </body>
      </html>
    );
  }

  return (
    <html lang="ru">
      <body>
        <AdminShell user={access.user}>{children}</AdminShell>
      </body>
    </html>
  );
}
