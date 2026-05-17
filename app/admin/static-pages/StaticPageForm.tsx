import { AdminActionTokenInput } from "@/components/admin/AdminActionTokenInput";
import type { StaticPage } from "@prisma/client";
import { AdminCheckbox, AdminField, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { createStaticPageAction, updateStaticPageAction } from "@/app/admin/static-pages/actions";

export function StaticPageForm({ page }: { page?: StaticPage }) {
  const action = page ? updateStaticPageAction.bind(null, page.id) : createStaticPageAction;

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminActionTokenInput />
      <AdminField label="Slug" name="slug" defaultValue={page?.slug} required />
      <AdminField label="RU title" name="titleRu" defaultValue={page?.titleRu} required />
      <AdminField label="EN title" name="titleEn" defaultValue={page?.titleEn} required />
      <AdminField label="RU description" name="descriptionRu" defaultValue={page?.descriptionRu} />
      <AdminField label="EN description" name="descriptionEn" defaultValue={page?.descriptionEn} />
      <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
        <AdminCheckbox label="Published" name="isPublished" defaultChecked={page?.isPublished} />
        <AdminCheckbox label="Noindex" name="noindex" defaultChecked={page?.noindex} />
      </div>
      <div className="md:col-span-2">
        <AdminTextarea label="RU content" name="contentRu" defaultValue={page?.contentRu} required rows={10} />
      </div>
      <div className="md:col-span-2">
        <AdminTextarea label="EN content" name="contentEn" defaultValue={page?.contentEn} required rows={10} />
      </div>
      <p className="md:col-span-2 rounded-md border border-white/10 bg-black/20 p-3 text-sm leading-6 text-zinc-400">
        Content is stored as plain markdown-like text and rendered safely as text paragraphs. No complex CMS editor or raw HTML is enabled.
      </p>
      <div className="md:col-span-2">
        <AdminSubmitButton>{page ? "Update page" : "Create page"}</AdminSubmitButton>
      </div>
    </form>
  );
}
