import { AdminLink } from "@/components/admin/AdminLink";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminSupportChannels } from "@/lib/admin/repositories/support";
import { toggleSupportChannelActiveAction } from "@/app/admin/support/actions";

import { AdminActionButton } from "@/components/admin/AdminActionButton";
export const metadata = createAdminMetadata("Support");
export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {

  const result = await getAdminSupportChannels();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageIntro title="Support" description="Manage public support channels." />
        <AdminLink className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black" href="/admin/support/new">New</AdminLink>
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Support rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "title", header: "Title", render: (row) => row.title },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "url", header: "URL", render: (row) => row.url },
          { key: "active", header: "Active", render: (row) => String(row.isActive) },
          { key: "edit", header: "Edit", render: (row) => <AdminLink className="font-bold text-orange-300" href={`/admin/support/${row.id}/edit`}>Edit</AdminLink> },
          { key: "toggle", header: "Toggle", render: (row) => <AdminActionButton action={toggleSupportChannelActiveAction} fields={{ id: row.id }}>{row.isActive ? "Deactivate" : "Activate"}</AdminActionButton> }
        ]}
        rows={result.data}
      />
    </div>
  );
}

function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-3xl font-black text-white">{title}</h1>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
