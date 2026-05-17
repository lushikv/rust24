import { AdminActionTokenInput } from "@/components/admin/AdminActionTokenInput";
import { AdminField, AdminSelect } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { registerMediaFileAction } from "@/app/admin/media/actions";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm"
];

export function MediaRegistryForm() {
  return (
    <form action={registerMediaFileAction} className="grid gap-4 rounded-md border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2">
      <AdminActionTokenInput />
      <div className="md:col-span-2">
        <h2 className="text-lg font-black text-white">Register media URL</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Upload storage is intentionally deferred. Register only already-hosted safe assets; SVG and executable uploads are not supported.
        </p>
      </div>
      <AdminField label="Filename" name="filename" defaultValue="asset.webp" required />
      <AdminField label="Original name" name="originalName" defaultValue="asset.webp" required />
      <AdminSelect label="MIME type" name="mimeType" defaultValue="image/webp">
        {allowedMimeTypes.map((mimeType) => (
          <option key={mimeType} value={mimeType}>
            {mimeType}
          </option>
        ))}
      </AdminSelect>
      <AdminField label="Size bytes" name="sizeBytes" type="number" defaultValue={1} required />
      <AdminField label="URL" name="url" defaultValue="/uploads/asset.webp" required />
      <AdminField label="Preview URL" name="previewUrl" />
      <AdminField label="Attached type" name="attachedToType" />
      <AdminField label="Attached id" name="attachedToId" />
      <div className="md:col-span-2">
        <AdminSubmitButton>Register media</AdminSubmitButton>
      </div>
    </form>
  );
}
