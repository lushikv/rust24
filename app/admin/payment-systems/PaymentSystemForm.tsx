import { AdminActionTokenInput } from "@/components/admin/AdminActionTokenInput";
import { AdminCheckbox, AdminField } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { updatePaymentSystemAction } from "@/app/admin/payment-systems/actions";
import type { PaymentProviderDefinition } from "@/lib/payments/provider-settings";

function stringConfigValue(config: Record<string, string | boolean>, key: string) {
  const value = config[key];
  return typeof value === "string" ? value : "";
}

export function PaymentSystemForm({
  definition,
  setting
}: {
  definition: PaymentProviderDefinition;
  setting: {
    displayName: string;
    isEnabled: boolean;
    configured: boolean;
    publicConfig: Record<string, string | boolean>;
  };
}) {
  const action = updatePaymentSystemAction.bind(null, definition.provider);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <AdminActionTokenInput />
      <AdminField label="Display name" name="displayName" defaultValue={setting.displayName || definition.displayName} required />
      <AdminCheckbox label="Enabled" name="isEnabled" defaultChecked={setting.isEnabled} />
      {definition.publicFields.map((field) =>
        field.key === "testMode" ? (
          <AdminCheckbox
            key={field.key}
            label={field.label}
            name={field.key}
            defaultChecked={setting.publicConfig[field.key] === true}
          />
        ) : (
          <AdminField
            key={field.key}
            label={field.label}
            name={field.key}
            defaultValue={stringConfigValue(setting.publicConfig, field.key)}
          />
        )
      )}
      <div className="md:col-span-2 rounded-md border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-6 text-orange-100">
        Secret values are encrypted before storage and never displayed. Enter a value only when creating or replacing the stored secret.
        Current secret status: <strong>{setting.configured ? "configured" : "not configured"}</strong>.
      </div>
      {definition.secretFields.map((field) => (
        <AdminField
          key={field.key}
          label={`${field.label} replacement`}
          name={`secret_${field.key}`}
          type="password"
        />
      ))}
      <p className="md:col-span-2 rounded-md border border-white/10 bg-black/20 p-3 text-sm leading-6 text-zinc-400">
        Configuration only. This does not connect checkout to {definition.displayName}, does not call provider APIs, and cannot mark payments successful.
      </p>
      <div className="md:col-span-2">
        <AdminSubmitButton>Save provider settings</AdminSubmitButton>
      </div>
    </form>
  );
}
