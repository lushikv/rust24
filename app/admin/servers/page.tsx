import { AdminLink } from "@/components/admin/AdminLink";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminServers } from "@/lib/admin/repositories/servers";
import { toggleServerActiveAction, toggleServerFeaturedAction } from "@/app/admin/servers/actions";

export const metadata = createAdminMetadata("Servers");
export const dynamic = "force-dynamic";

export default async function AdminServersPage() {

  const result = await getAdminServers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageIntro title="Servers" description="Manage server configuration and latest stored status snapshots." />
        <AdminLink className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black hover:bg-orange-400" href="/admin/servers/new">New</AdminLink>
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Server rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "priority", header: "Priority", render: (row) => row.sortOrder },
          { key: "title", header: "Title", render: (row) => row.title },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "publicAddress", header: "Public address", render: (row) => row.publicAddress },
          { key: "mode", header: "Mode", render: (row) => row.mode },
          { key: "region", header: "Region", render: (row) => row.region },
          { key: "team", header: "Team", render: (row) => row.teamLimit },
          { key: "active", header: "Active", render: (row) => <AdminStatusBadge>{row.isActive}</AdminStatusBadge> },
          { key: "featured", header: "Featured", render: (row) => <AdminStatusBadge>{row.isFeatured}</AdminStatusBadge> },
          { key: "rcon", header: "RCON", render: (row) => <AdminStatusBadge>{row.rconConfigured ? "configured" : "disabled"}</AdminStatusBadge> },
          { key: "status", header: "Latest status", render: (row) => row.latestStatus },
          { key: "detail", header: "Detail", render: (row) => <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/servers/${row.id}`}>Open</AdminLink> },
          { key: "products", header: "Products", render: (row) => <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/servers/${row.id}/products`}>Products</AdminLink> },
          { key: "edit", header: "Edit", render: (row) => <AdminLink className="font-bold text-orange-300 hover:text-orange-200" href={`/admin/servers/${row.id}/edit`}>Edit</AdminLink> },
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
