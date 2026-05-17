import { AdminLink } from "@/components/admin/AdminLink";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { MediaRegistryForm } from "@/app/admin/media/MediaRegistryForm";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminMediaFiles } from "@/lib/admin/repositories/media";

export const metadata = createAdminMetadata("Media");
export const dynamic = "force-dynamic";

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const result = await getAdminMediaFiles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Media</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Safe media registry for already-hosted images and videos. Direct upload storage is deferred.
        </p>
      </div>
      {!result.available ? (
        <AdminStatusNotice message="Database is unavailable. Media registry rows cannot be loaded or created." />
      ) : (
        <MediaRegistryForm />
      )}
      <AdminDataTable
        columns={[
          {
            key: "preview",
            header: "Preview",
            render: (row) =>
              row.previewUrl || row.url ? (
                <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={row.previewUrl ?? row.url}>
                  Open
                </AdminLink>
              ) : (
                <span className="text-zinc-500">None</span>
              )
          },
          { key: "filename", header: "Filename", render: (row) => row.filename },
          { key: "original", header: "Original", render: (row) => row.originalName },
          { key: "mime", header: "MIME", render: (row) => row.mimeType },
          { key: "size", header: "Size", render: (row) => formatBytes(row.sizeBytes) },
          { key: "url", header: "URL", render: (row) => <span className="break-all">{row.url}</span> },
          {
            key: "attached",
            header: "Attached",
            render: (row) =>
              row.attachedToType ? `${row.attachedToType}${row.attachedToId ? `:${row.attachedToId}` : ""}` : "Unattached"
          },
          { key: "created", header: "Created", render: (row) => new Date(row.createdAt).toLocaleString("en-GB") }
        ]}
        rows={result.data}
        emptyTitle="No media files"
        emptyDescription="Register external or previously uploaded media when content needs an asset reference."
      />
    </div>
  );
}
