import { AdminActionTokenInput } from "@/components/admin/AdminActionTokenInput";
import { ProductStatus, ProductType, type Product, type ProductCategory, type ProductTranslation } from "@prisma/client";
import { AdminCheckbox, AdminField, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { createProductAction, updateProductAction } from "@/app/admin/products/actions";

type ProductWithTranslations = Product & { translations: ProductTranslation[] };

function translation(product: ProductWithTranslations | undefined, locale: "RU" | "EN") {
  return product?.translations.find((item) => item.locale === locale);
}

export function ProductForm({
  product,
  categories
}: {
  product?: ProductWithTranslations;
  categories: ProductCategory[];
}) {
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const ru = translation(product, "RU");
  const en = translation(product, "EN");

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminActionTokenInput />
      <AdminSelect label="Category" name="categoryId" defaultValue={product?.categoryId}>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.titleEn}</option>)}
      </AdminSelect>
      <AdminField label="Slug" name="slug" defaultValue={product?.slug} required />
      <AdminSelect label="Type" name="type" defaultValue={product?.type ?? ProductType.PRIVILEGE}>
        {Object.values(ProductType).map((item) => <option key={item} value={item}>{item}</option>)}
      </AdminSelect>
      <AdminSelect label="Status" name="status" defaultValue={product?.status ?? ProductStatus.ACTIVE}>
        {Object.values(ProductStatus).map((item) => <option key={item} value={item}>{item}</option>)}
      </AdminSelect>
      <AdminField label="Price RUB" name="priceRub" type="number" defaultValue={product?.priceRub ?? 0} required />
      <AdminField label="Price EUR" name="priceEur" type="number" defaultValue={product?.priceEur} />
      <AdminField label="Old price RUB" name="oldPriceRub" type="number" defaultValue={product?.oldPriceRub} />
      <AdminField label="Old price EUR" name="oldPriceEur" type="number" defaultValue={product?.oldPriceEur} />
      <AdminField label="Duration days" name="durationDays" type="number" defaultValue={product?.durationDays} />
      <AdminField label="Image URL" name="imageUrl" type="url" defaultValue={product?.imageUrl} />
      <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} />
      <AdminCheckbox label="Featured" name="isFeatured" defaultChecked={product?.isFeatured} />
      <AdminField label="RU title" name="ruTitle" defaultValue={ru?.title} required />
      <AdminField label="EN title" name="enTitle" defaultValue={en?.title} required />
      <AdminTextarea label="RU description" name="ruDescription" defaultValue={ru?.description} required />
      <AdminTextarea label="EN description" name="enDescription" defaultValue={en?.description} required />
      <AdminTextarea label="RU short description" name="ruShortDescription" defaultValue={ru?.shortDescription} />
      <AdminTextarea label="EN short description" name="enShortDescription" defaultValue={en?.shortDescription} />
      <AdminTextarea label="RU included items, one per line" name="ruIncludedItems" defaultValue={ru?.includedItems.join("\n")} />
      <AdminTextarea label="EN included items, one per line" name="enIncludedItems" defaultValue={en?.includedItems.join("\n")} />
      <AdminTextarea label="RU restrictions, one per line" name="ruModeRestrictions" defaultValue={ru?.modeRestrictions.join("\n")} />
      <AdminTextarea label="EN restrictions, one per line" name="enModeRestrictions" defaultValue={en?.modeRestrictions.join("\n")} />
      <div className="md:col-span-2"><AdminSubmitButton>{product ? "Update product" : "Create product"}</AdminSubmitButton></div>
    </form>
  );
}
