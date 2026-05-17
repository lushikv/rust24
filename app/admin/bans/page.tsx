import { AdminLink } from "@/components/admin/AdminLink";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminBans } from "@/lib/admin/repositories/bans";

export const metadata = createAdminMetadata("Bans");
export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminBansPage() {

  const result = await getAdminBans();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageIntro title="Bans" description="Manage public ban records." />
        <AdminLink className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black" href="/admin/bans/new">New</AdminLink>
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Ban rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "player", header: "Player", render: (row) => row.playerName },
          { key: "reason", header: "Reason", render: (row) => row.reason },
          { key: "server", header: "Server", render: (row) => row.serverName },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "banned", header: "Banned", render: (row) => formatDate(row.bannedAt) },
          { key: "expires", header: "Expires", render: (row) => row.expiresAt ? formatDate(row.expiresAt) : "Never" },
          { key: "edit", header: "Edit", render: (row) => <AdminLink className="font-bold text-orange-300" href={`/admin/bans/${row.id}/edit`}>Edit</AdminLink> }
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
