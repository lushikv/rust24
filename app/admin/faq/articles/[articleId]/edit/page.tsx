import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { prisma } from "@/lib/prisma";
import { FAQArticleForm } from "@/app/admin/faq/FAQForms";

type PageProps = { params: Promise<{ articleId: string }> };
export const metadata = createAdminMetadata("Edit FAQ Article");
export default async function EditFAQArticlePage({ params }: PageProps) {
  const { articleId } = await params;
  const [article, categories] = await Promise.all([
    prisma.fAQArticle.findUnique({ where: { id: articleId } }),
    prisma.fAQCategory.findMany({ orderBy: { sortOrder: "asc" } })
  ]);
  if (!article) notFound();
  return <AdminFormShell title="Edit FAQ article" description="Update FAQ article." backHref="/admin/faq"><FAQArticleForm article={article} categories={categories} /></AdminFormShell>;
}
