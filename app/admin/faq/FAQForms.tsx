import { AdminActionTokenInput } from "@/components/admin/AdminActionTokenInput";
import type { FAQArticle, FAQCategory } from "@prisma/client";
import { AdminCheckbox, AdminField, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import {
  createFAQArticleAction,
  createFAQCategoryAction,
  updateFAQArticleAction,
  updateFAQCategoryAction
} from "@/app/admin/faq/actions";

export function FAQCategoryForm({ category }: { category?: FAQCategory }) {
  const action = category ? updateFAQCategoryAction.bind(null, category.id) : createFAQCategoryAction;
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminActionTokenInput />
      <AdminField label="Slug" name="slug" defaultValue={category?.slug} required />
      <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
      <AdminField label="Title RU" name="titleRu" defaultValue={category?.titleRu} required />
      <AdminField label="Title EN" name="titleEn" defaultValue={category?.titleEn} required />
      <AdminCheckbox label="Active" name="isActive" defaultChecked={category?.isActive ?? true} />
      <div className="md:col-span-2"><AdminSubmitButton>{category ? "Update category" : "Create category"}</AdminSubmitButton></div>
    </form>
  );
}

export function FAQArticleForm({ article, categories }: { article?: FAQArticle; categories: FAQCategory[] }) {
  const action = article ? updateFAQArticleAction.bind(null, article.id) : createFAQArticleAction;
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminActionTokenInput />
      <AdminSelect label="Category" name="categoryId" defaultValue={article?.categoryId}>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.titleEn}</option>)}
      </AdminSelect>
      <AdminField label="Slug" name="slug" defaultValue={article?.slug} required />
      <AdminField label="Question RU" name="questionRu" defaultValue={article?.questionRu} required />
      <AdminField label="Question EN" name="questionEn" defaultValue={article?.questionEn} required />
      <AdminTextarea label="Answer RU" name="answerRu" defaultValue={article?.answerRu} required />
      <AdminTextarea label="Answer EN" name="answerEn" defaultValue={article?.answerEn} required />
      <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={article?.sortOrder ?? 0} />
      <AdminCheckbox label="Published" name="isPublished" defaultChecked={article?.isPublished ?? true} />
      <div className="md:col-span-2"><AdminSubmitButton>{article ? "Update article" : "Create article"}</AdminSubmitButton></div>
    </form>
  );
}
