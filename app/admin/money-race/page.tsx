import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getAdminMoneyRaceSeasons } from "@/lib/admin/repositories/money-race";
import { toggleMoneyRaceSeasonActiveAction } from "@/app/admin/money-race/actions";

export const metadata = createAdminMetadata("Money Race");
export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminMoneyRacePage() {
  const access = await getAdminAccess("moneyRace");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  const result = await getAdminMoneyRaceSeasons();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageIntro title="Money Race" description="Manage seasons. Leaderboard entry editing remains deferred." />
        <Link className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black" href="/admin/money-race/seasons/new">New season</Link>
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Money Race rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "title", header: "Title", render: (row) => row.title },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "pool", header: "Prize RUB", render: (row) => row.prizePoolRub },
          { key: "starts", header: "Starts", render: (row) => formatDate(row.startsAt) },
          { key: "ends", header: "Ends", render: (row) => formatDate(row.endsAt) },
          { key: "active", header: "Active", render: (row) => String(row.isActive) },
          { key: "entries", header: "Entries", render: (row) => row.entriesCount },
          { key: "edit", header: "Edit", render: (row) => <Link className="font-bold text-orange-300" href={`/admin/money-race/seasons/${row.id}/edit`}>Edit</Link> },
          { key: "toggle", header: "Toggle", render: (row) => <AdminActionButton action={toggleMoneyRaceSeasonActiveAction} fields={{ id: row.id }}>{row.isActive ? "Deactivate" : "Activate"}</AdminActionButton> }
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
