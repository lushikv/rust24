import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { MoneyRaceSeasonForm } from "@/app/admin/money-race/MoneyRaceSeasonForm";

export const metadata = createAdminMetadata("New Money Race Season");
export default async function NewMoneyRaceSeasonPage() {
  const access = await getAdminAccess("moneyRace");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  return <AdminFormShell title="New Money Race season" description="Create a season. Only one active season is allowed." backHref="/admin/money-race"><MoneyRaceSeasonForm /></AdminFormShell>;
}
