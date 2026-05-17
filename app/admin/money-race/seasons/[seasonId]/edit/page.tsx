import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { MoneyRaceSeasonForm } from "@/app/admin/money-race/MoneyRaceSeasonForm";

type PageProps = { params: Promise<{ seasonId: string }> };
export const metadata = createAdminMetadata("Edit Money Race Season");
export default async function EditMoneyRaceSeasonPage({ params }: PageProps) {
  const { seasonId } = await params;
  const season = await prisma.moneyRaceSeason.findUnique({ where: { id: seasonId } });
  if (!season) notFound();
  return <AdminFormShell title="Edit Money Race season" description="Update season settings." backHref="/admin/money-race"><MoneyRaceSeasonForm season={season} /></AdminFormShell>;
}
