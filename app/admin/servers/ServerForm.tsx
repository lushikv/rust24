import { TeamLimit, type Server } from "@prisma/client";
import { AdminCheckbox, AdminField, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { createServerAction, updateServerAction } from "@/app/admin/servers/actions";

export function ServerForm({ server }: { server?: Server }) {
  const action = server ? updateServerAction.bind(null, server.id) : createServerAction;

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminField label="Slug" name="slug" defaultValue={server?.slug} required />
      <AdminField label="Mode" name="mode" defaultValue={server?.mode} required />
      <AdminField label="Title RU" name="titleRu" defaultValue={server?.titleRu} required />
      <AdminField label="Title EN" name="titleEn" defaultValue={server?.titleEn} required />
      <AdminTextarea label="Description RU" name="descriptionRu" defaultValue={server?.descriptionRu} />
      <AdminTextarea label="Description EN" name="descriptionEn" defaultValue={server?.descriptionEn} />
      <AdminField label="Region" name="region" defaultValue={server?.region} required />
      <AdminSelect label="Team limit" name="teamLimit" defaultValue={server?.teamLimit ?? TeamLimit.NO_LIMIT}>
        {Object.values(TeamLimit).map((item) => <option key={item} value={item}>{item}</option>)}
      </AdminSelect>
      <AdminField label="Address" name="address" defaultValue={server?.address} required />
      <AdminField label="Connect command" name="connectCommand" defaultValue={server?.connectCommand} required />
      <AdminField label="Wipe schedule RU" name="wipeScheduleRu" defaultValue={server?.wipeScheduleRu} required />
      <AdminField label="Wipe schedule EN" name="wipeScheduleEn" defaultValue={server?.wipeScheduleEn} required />
      <AdminField label="Capacity" name="capacity" type="number" defaultValue={server?.capacity ?? 100} required />
      <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={server?.sortOrder ?? 0} />
      <AdminCheckbox label="Featured" name="isFeatured" defaultChecked={server?.isFeatured} />
      <AdminCheckbox label="Active" name="isActive" defaultChecked={server?.isActive ?? true} />
      <div className="md:col-span-2">
        <AdminSubmitButton>{server ? "Update server" : "Create server"}</AdminSubmitButton>
      </div>
    </form>
  );
}
