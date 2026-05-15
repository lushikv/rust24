import type { RuleItem, RuleSection } from "@prisma/client";
import { AdminCheckbox, AdminField, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { createRuleItemAction, createRuleSectionAction, updateRuleItemAction, updateRuleSectionAction } from "@/app/admin/rules/actions";

export function RuleSectionForm({ section }: { section?: RuleSection }) {
  const action = section ? updateRuleSectionAction.bind(null, section.id) : createRuleSectionAction;
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminField label="Slug" name="slug" defaultValue={section?.slug} required />
      <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={section?.sortOrder ?? 0} />
      <AdminField label="Title RU" name="titleRu" defaultValue={section?.titleRu} required />
      <AdminField label="Title EN" name="titleEn" defaultValue={section?.titleEn} required />
      <AdminTextarea label="Description RU" name="descriptionRu" defaultValue={section?.descriptionRu} />
      <AdminTextarea label="Description EN" name="descriptionEn" defaultValue={section?.descriptionEn} />
      <AdminCheckbox label="Published" name="isPublished" defaultChecked={section?.isPublished ?? true} />
      <div className="md:col-span-2"><AdminSubmitButton>{section ? "Update section" : "Create section"}</AdminSubmitButton></div>
    </form>
  );
}

export function RuleItemForm({ item, sections }: { item?: RuleItem; sections: RuleSection[] }) {
  const action = item ? updateRuleItemAction.bind(null, item.id) : createRuleItemAction;
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminSelect label="Section" name="sectionId" defaultValue={item?.sectionId}>
        {sections.map((section) => <option key={section.id} value={section.id}>{section.titleEn}</option>)}
      </AdminSelect>
      <AdminField label="Code" name="code" defaultValue={item?.code} />
      <AdminTextarea label="Text RU" name="textRu" defaultValue={item?.textRu} required />
      <AdminTextarea label="Text EN" name="textEn" defaultValue={item?.textEn} required />
      <AdminField label="Severity" name="severity" defaultValue={item?.severity} />
      <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
      <div className="md:col-span-2"><AdminSubmitButton>{item ? "Update item" : "Create item"}</AdminSubmitButton></div>
    </form>
  );
}
