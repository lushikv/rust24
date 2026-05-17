import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { getAdminAccess } from "@/lib/admin/require-admin";
import type { AdminSection } from "@/lib/admin/permissions";

export async function AdminComingSoonPage({
  title,
  description,
  section
}: {
  title: string;
  description: string;
  section: AdminSection;
}) {
  const access = await getAdminAccess(section);
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">{title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{description}</p>
      </div>
      <AdminEmptyState
        title="Coming in Admin v2"
        description="This section is intentionally prepared as a safe placeholder. No write actions or public data exposure are enabled yet."
      />
    </div>
  );
}
