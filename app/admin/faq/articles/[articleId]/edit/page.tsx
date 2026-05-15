import { notFound } from "next/navigation";
import { AdminForbidden } from "@/components/admin/AdminForbidden";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { FAQArticleForm } from "@/app/admin/faq/FAQForms";

type PageProps = { params: Promise<{ articleId: string }> };
export const metadata = createAdminMetadata("Edit FAQ Article");
export default async function EditFAQArticlePage({ params }: PageProps) {
  const access = await getAdminAccess("faq");
  if (access.status === "unauthenticated") return <AdminForbidden type="login" />;
  if (access.status === "forbidden") return <AdminForbidden type="forbidden" />;
  const { articleId } = await params;
  const [article, categories] = await Promise.all([
    prisma.fAQArticle.findUnique({ where: { id: articleId } }),
    prisma.fAQCategory.findMany({ orderBy: { sortOrder: "asc" } })
  ]);
  if (!article) notFound();
  return <AdminFormShell title="Edit FAQ article" description="Update FAQ article." backHref="/admin/faq"><FAQArticleForm article={article} categories={categories} /></AdminFormShell>;
}
