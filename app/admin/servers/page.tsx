import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getAdminServers } from "@/lib/admin/repositories/servers";
import { toggleServerActiveAction, toggleServerFeaturedAction } from "@/app/admin/servers/actions";

export const metadata = createAdminMetadata("Servers");
export const dynamic = "force-dynamic";

export default async function AdminServersPage() {
  const access = await getAdminAccess("servers");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  const result = await getAdminServers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageIntro title="Servers" description="Manage server configuration and latest stored status snapshots." />
        <Link className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black hover:bg-orange-400" href="/admin/servers/new">New</Link>
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Server rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "title", header: "Title", render: (row) => row.title },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "mode", header: "Mode", render: (row) => row.mode },
          { key: "region", header: "Region", render: (row) => row.region },
          { key: "team", header: "Team", render: (row) => row.teamLimit },
          { key: "active", header: "Active", render: (row) => String(row.isActive) },
          { key: "featured", header: "Featured", render: (row) => String(row.isFeatured) },
          { key: "status", header: "Latest status", render: (row) => row.latestStatus },
          { key: "edit", header: "Edit", render: (row) => <Link className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/servers/${row.id}/edit`}>Edit</Link> },
          { key: "toggleActive", header: "Active", render: (row) => <AdminActionButton action={toggleServerActiveAction} fields={{ id: row.id }}>{row.isActive ? "Deactivate" : "Activate"}</AdminActionButton> },
          { key: "toggleFeatured", header: "Featured", render: (row) => <AdminActionButton action={toggleServerFeaturedAction} fields={{ id: row.id }}>{row.isFeatured ? "Unfeature" : "Feature"}</AdminActionButton> }
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
import Link from "next/link";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
