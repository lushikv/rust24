import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { FAQArticleForm } from "@/app/admin/faq/FAQForms";

export const metadata = createAdminMetadata("New FAQ Article");
export default async function NewFAQArticlePage() {
  const categories = await prisma.fAQCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminFormShell title="New FAQ article" description="Create a FAQ article." backHref="/admin/faq"><FAQArticleForm categories={categories} /></AdminFormShell>;
}
