import { AdminActionTokenInput } from "@/components/admin/AdminActionTokenInput";
import {
  ProductStatus,
  ProductType,
  type Product,
  type ProductCategory,
  type ProductCommandTemplate,
  type ProductServer,
  type ProductTranslation,
  type Server
} from "@prisma/client";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminCheckbox, AdminField, AdminSelect, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import {
  createCommandTemplateAction,
  createServerProductAction,
  toggleCommandTemplateActiveAction,
  updateCommandTemplateAction,
  updateServerProductAction
} from "@/app/admin/servers/[serverId]/products/actions";
import { allowedDeliveryCommandPlaceholders } from "@/lib/delivery/command-template-validation";

type ProductForServerForm = Product & {
  translations: ProductTranslation[];
  productServers: ProductServer[];
  commandTemplates: ProductCommandTemplate[];
};

function translation(product: ProductForServerForm | null | undefined, locale: "RU" | "EN") {
  return product?.translations.find((item) => item.locale === locale);
}

export function ServerProductForm({
  serverId,
  product,
  categories,
  servers
}: {
  serverId: string;
  product?: ProductForServerForm | null;
  categories: ProductCategory[];
  servers: Server[];
}) {
  const action = product
    ? updateServerProductAction.bind(null, serverId, product.id)
    : createServerProductAction.bind(null, serverId);
  const ru = translation(product, "RU");
  const en = translation(product, "EN");
  const selectedServerIds = new Set(product?.productServers.map((item) => item.serverId) ?? [serverId]);

  return (
    <div className="space-y-8">
      <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminActionTokenInput />
        <AdminSelect label="Category" name="categoryId" defaultValue={product?.categoryId}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.titleEn}
            </option>
          ))}
        </AdminSelect>
        <AdminField label="Slug" name="slug" defaultValue={product?.slug} required />
        <AdminSelect label="Type" name="type" defaultValue={product?.type ?? ProductType.PRIVILEGE}>
          {Object.values(ProductType).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect label="Status" name="status" defaultValue={product?.status ?? ProductStatus.ACTIVE}>
          {Object.values(ProductStatus).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
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
        <AdminTextarea label="RU short description" name="ruShortDescription" defaultValue={ru?.shortDescription} />
        <AdminTextarea label="EN short description" name="enShortDescription" defaultValue={en?.shortDescription} />
        <AdminTextarea label="RU description" name="ruDescription" defaultValue={ru?.description} required />
        <AdminTextarea label="EN description" name="enDescription" defaultValue={en?.description} required />
        <AdminTextarea label="RU included items, one per line" name="ruIncludedItems" defaultValue={ru?.includedItems.join("\n")} />
        <AdminTextarea label="EN included items, one per line" name="enIncludedItems" defaultValue={en?.includedItems.join("\n")} />
        <AdminTextarea label="RU restrictions, one per line" name="ruModeRestrictions" defaultValue={ru?.modeRestrictions.join("\n")} />
        <AdminTextarea label="EN restrictions, one per line" name="enModeRestrictions" defaultValue={en?.modeRestrictions.join("\n")} />
        <fieldset className="rounded-md border border-white/10 bg-black/20 p-4 md:col-span-2">
          <legend className="px-2 text-sm font-black text-white">Server availability</legend>
          <p className="mt-1 text-sm text-zinc-400">
            Product can be global in the public store, but these links mark which servers it is available for.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {servers.map((server) => (
              <label
                className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-bold text-zinc-200"
                key={server.id}
              >
                <input
                  className="h-4 w-4 accent-orange-500"
                  defaultChecked={selectedServerIds.has(server.id) || server.id === serverId}
                  disabled={server.id === serverId}
                  name="serverIds"
                  type="checkbox"
                  value={server.id}
                />
                {server.titleEn} <span className="text-zinc-500">/{server.slug}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="md:col-span-2">
          <AdminSubmitButton>{product ? "Update server product" : "Create server product"}</AdminSubmitButton>
        </div>
      </form>
      {product ? (
        <CommandTemplatesSection
          productId={product.id}
          serverId={serverId}
          templates={product.commandTemplates}
        />
      ) : null}
    </div>
  );
}

function CommandTemplatesSection({
  productId,
  serverId,
  templates
}: {
  productId: string;
  serverId: string;
  templates: ProductCommandTemplate[];
}) {
  return (
    <section className="space-y-4 rounded-lg border border-orange-400/20 bg-orange-950/10 p-5">
      <div>
        <h2 className="text-xl font-black text-white">Delivery command templates</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Commands are stored only. They are not executed in this stage and will be used only after verified payment and a future delivery worker.
        </p>
        <p className="mt-2 text-xs font-bold text-orange-200">
          Allowed placeholders: {allowedDeliveryCommandPlaceholders.map((item) => `{${item}}`).join(", ")}
        </p>
      </div>
      <div className="space-y-3">
        {templates.map((template) => (
          <CommandTemplateForm
            key={template.id}
            productId={productId}
            serverId={serverId}
            template={template}
          />
        ))}
      </div>
      <CommandTemplateForm productId={productId} serverId={serverId} />
    </section>
  );
}

function CommandTemplateForm({
  productId,
  serverId,
  template
}: {
  productId: string;
  serverId: string;
  template?: ProductCommandTemplate;
}) {
  const action = template
    ? updateCommandTemplateAction.bind(null, serverId, productId, template.id)
    : createCommandTemplateAction.bind(null, serverId, productId);

  return (
    <form action={action} className="grid gap-3 rounded-md border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_180px]">
      <AdminActionTokenInput />
      <div className="space-y-3">
        <AdminTextarea
          label={template ? "Command template" : "New command template"}
          name="commandTemplate"
          defaultValue={template?.commandTemplate}
          required={Boolean(template)}
          rows={3}
        />
        <AdminField label="Description" name="description" defaultValue={template?.description} />
      </div>
      <div className="space-y-3">
        <AdminField label="Sort order" name="sortOrder" type="number" defaultValue={template?.sortOrder ?? 0} />
        <AdminCheckbox label="Active" name="isActive" defaultChecked={template?.isActive ?? true} />
        <AdminSubmitButton>{template ? "Update template" : "Add template"}</AdminSubmitButton>
        {template ? (
          <AdminActionButton
            action={toggleCommandTemplateActiveAction.bind(null, serverId, productId)}
            fields={{ templateId: template.id }}
          >
            {template.isActive ? "Disable" : "Enable"}
          </AdminActionButton>
        ) : null}
      </div>
    </form>
  );
}
