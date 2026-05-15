import type { SupportChannel } from "@prisma/client";
import { AdminCheckbox, AdminField, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { createSupportChannelAction, updateSupportChannelAction } from "@/app/admin/support/actions";

export function SupportForm({ channel }: { channel?: SupportChannel }) {
  const action = channel ? updateSupportChannelAction.bind(null, channel.id) : createSupportChannelAction;
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminField label="Slug" name="slug" defaultValue={channel?.slug} required />
      <AdminField label="URL" name="url" type="url" defaultValue={channel?.url} required />
      <AdminField label="Title RU" name="titleRu" defaultValue={channel?.titleRu} required />
      <AdminField label="Title EN" name="titleEn" defaultValue={channel?.titleEn} required />
      <AdminTextarea label="Description RU" name="descriptionRu" defaultValue={channel?.descriptionRu} required />
      <AdminTextarea label="Description EN" name="descriptionEn" defaultValue={channel?.descriptionEn} required />
      <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={channel?.sortOrder ?? 0} />
      <AdminCheckbox label="Active" name="isActive" defaultChecked={channel?.isActive ?? true} />
      <div className="md:col-span-2"><AdminSubmitButton>{channel ? "Update channel" : "Create channel"}</AdminSubmitButton></div>
    </form>
  );
}
