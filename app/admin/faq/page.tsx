import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getAdminFAQ } from "@/lib/admin/repositories/faq";
import { toggleFAQArticlePublishedAction } from "@/app/admin/faq/actions";

export const metadata = createAdminMetadata("FAQ");
export const dynamic = "force-dynamic";

export default async function AdminFAQPage() {
  const access = await getAdminAccess("faq");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  const result = await getAdminFAQ();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageIntro title="FAQ" description="Manage FAQ categories and articles. Complex editing is deferred." />
        <div className="flex gap-2">
          <Link className="rounded-md border border-white/10 px-4 py-3 text-sm font-black text-white" href="/admin/faq/categories">Categories</Link>
          <Link className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black" href="/admin/faq/articles/new">New article</Link>
        </div>
      </div>
      {!result.available ? <AdminStatusNotice message="Database is unavailable. FAQ rows cannot be loaded." /> : null}
      <AdminDataTable
        columns={[
          { key: "category", header: "Category", render: (row) => row.category },
          { key: "slug", header: "Slug", render: (row) => row.slug },
          { key: "question", header: "Question", render: (row) => row.question },
          { key: "published", header: "Published", render: (row) => String(row.isPublished) },
          { key: "edit", header: "Edit", render: (row) => <Link className="font-bold text-orange-300" href={`/admin/faq/articles/${row.id}/edit`}>Edit</Link> },
          { key: "toggle", header: "Toggle", render: (row) => <AdminActionButton action={toggleFAQArticlePublishedAction} fields={{ id: row.id }}>{row.isPublished ? "Unpublish" : "Publish"}</AdminActionButton> }
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
