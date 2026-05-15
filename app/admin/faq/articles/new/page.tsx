import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { FAQArticleForm } from "@/app/admin/faq/FAQForms";

export const metadata = createAdminMetadata("New FAQ Article");
export default async function NewFAQArticlePage() {
  const access = await getAdminAccess("faq");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const categories = await prisma.fAQCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminFormShell title="New FAQ article" description="Create a FAQ article." backHref="/admin/faq"><FAQArticleForm categories={categories} /></AdminFormShell>;
}
