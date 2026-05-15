import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getAdminRuleSections } from "@/lib/admin/repositories/rules";
import { toggleRuleSectionPublishedAction } from "@/app/admin/rules/actions";

export const metadata = createAdminMetadata("Rules");
export const dynamic = "force-dynamic";

export default async function AdminRulesPage() {
  const access = await getAdminAccess("rules");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  const result = await getAdminRuleSections();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageIntro title="Rules" description="Manage rule sections. Rule item forms are available separately." />
        <div className="flex gap-2">
          <Link className="rounded-md border border-white/10 px-4 py-3 text-sm font-black text-white" href="/admin/rules/items/new">New item</Link>
          <Link className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black" href="/admin/rules/sections/new">New section</Link>
        </div>
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. Rule rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "title", header: "Title", render: (row) => row.title },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "published", header: "Published", render: (row) => String(row.isPublished) },
          { key: "items", header: "Items", render: (row) => row.itemCount },
          { key: "edit", header: "Edit", render: (row) => <Link className="font-bold text-orange-300" href={`/admin/rules/sections/${row.id}/edit`}>Edit</Link> },
          { key: "toggle", header: "Toggle", render: (row) => <AdminActionButton action={toggleRuleSectionPublishedAction} fields={{ id: row.id }}>{row.isPublished ? "Unpublish" : "Publish"}</AdminActionButton> }
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
