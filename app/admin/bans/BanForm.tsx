import { BanStatus, type BanRecord } from "@prisma/client";
import { AdminField, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { createBanAction, updateBanAction } from "@/app/admin/bans/actions";

function toInputDate(value?: Date | null) {
  return value ? value.toISOString().slice(0, 16) : "";
}

export function BanForm({ ban }: { ban?: BanRecord }) {
  const action = ban ? updateBanAction.bind(null, ban.id) : createBanAction;
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminField label="Player name" name="playerName" defaultValue={ban?.playerName} required />
      <AdminField label="Player public ID" name="playerPublicId" defaultValue={ban?.playerPublicId} />
      <AdminTextarea label="Reason RU" name="reasonRu" defaultValue={ban?.reasonRu} required />
      <AdminTextarea label="Reason EN" name="reasonEn" defaultValue={ban?.reasonEn} required />
      <AdminField label="Server name" name="serverName" defaultValue={ban?.serverName} required />
      <AdminSelect label="Status" name="status" defaultValue={ban?.status ?? BanStatus.ACTIVE}>
        {Object.values(BanStatus).map((item) => <option key={item} value={item}>{item}</option>)}
      </AdminSelect>
      <AdminField label="Banned at" name="bannedAt" type="datetime-local" defaultValue={toInputDate(ban?.bannedAt)} required />
      <AdminField label="Expires at" name="expiresAt" type="datetime-local" defaultValue={toInputDate(ban?.expiresAt)} />
      <div className="md:col-span-2"><AdminSubmitButton>{ban ? "Update ban" : "Create ban"}</AdminSubmitButton></div>
    </form>
  );
}
