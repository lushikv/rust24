import type { ProductCategory } from "@prisma/client";
import { AdminCheckbox, AdminField, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { createProductCategoryAction, updateProductCategoryAction } from "@/app/admin/products/actions";

export function ProductCategoryForm({ category }: { category?: ProductCategory }) {
  const action = category ? updateProductCategoryAction.bind(null, category.id) : createProductCategoryAction;

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminField label="Slug" name="slug" defaultValue={category?.slug} required />
      <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
      <AdminField label="Title RU" name="titleRu" defaultValue={category?.titleRu} required />
      <AdminField label="Title EN" name="titleEn" defaultValue={category?.titleEn} required />
      <AdminTextarea label="Description RU" name="descriptionRu" defaultValue={category?.descriptionRu} />
      <AdminTextarea label="Description EN" name="descriptionEn" defaultValue={category?.descriptionEn} />
      <AdminCheckbox label="Active" name="isActive" defaultChecked={category?.isActive ?? true} />
      <div className="md:col-span-2"><AdminSubmitButton>{category ? "Update category" : "Create category"}</AdminSubmitButton></div>
    </form>
  );
}
