import type { MoneyRaceSeason } from "@prisma/client";
import { AdminCheckbox, AdminField } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { createMoneyRaceSeasonAction, updateMoneyRaceSeasonAction } from "@/app/admin/money-race/actions";

function toInputDate(value?: Date | null) {
  return value ? value.toISOString().slice(0, 16) : "";
}

export function MoneyRaceSeasonForm({ season }: { season?: MoneyRaceSeason }) {
  const action = season ? updateMoneyRaceSeasonAction.bind(null, season.id) : createMoneyRaceSeasonAction;
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminField label="Slug" name="slug" defaultValue={season?.slug} required />
      <AdminField label="Prize pool RUB" name="prizePoolRub" type="number" defaultValue={season?.prizePoolRub ?? 0} />
      <AdminField label="Title RU" name="titleRu" defaultValue={season?.titleRu} required />
      <AdminField label="Title EN" name="titleEn" defaultValue={season?.titleEn} required />
      <AdminField label="Starts at" name="startsAt" type="datetime-local" defaultValue={toInputDate(season?.startsAt)} required />
      <AdminField label="Ends at" name="endsAt" type="datetime-local" defaultValue={toInputDate(season?.endsAt)} required />
      <AdminCheckbox label="Active" name="isActive" defaultChecked={season?.isActive} />
      <div className="md:col-span-2"><AdminSubmitButton>{season ? "Update season" : "Create season"}</AdminSubmitButton></div>
    </form>
  );
}
