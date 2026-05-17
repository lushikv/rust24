import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { MoneyRaceSeasonForm } from "@/app/admin/money-race/MoneyRaceSeasonForm";

export const metadata = createAdminMetadata("New Money Race Season");
export default async function NewMoneyRaceSeasonPage() {
  return <AdminFormShell title="New Money Race season" description="Create a season. Only one active season is allowed." backHref="/admin/money-race"><MoneyRaceSeasonForm /></AdminFormShell>;
}
