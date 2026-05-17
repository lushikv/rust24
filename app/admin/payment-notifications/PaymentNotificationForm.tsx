import { AdminActionTokenInput } from "@/components/admin/AdminActionTokenInput";
import { AdminCheckbox, AdminField, AdminTextarea } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { updatePaymentNotificationAction } from "@/app/admin/payment-notifications/actions";
import { telegramPaymentTemplateVariables } from "@/lib/notifications/telegram-template";

export function PaymentNotificationForm({
  setting
}: {
  setting: {
    isEnabled: boolean;
    configured: boolean;
    chatId: string | null;
    messageTemplate: string;
    preview: string;
  };
}) {
  return (
    <form action={updatePaymentNotificationAction} className="grid gap-4 md:grid-cols-2">
      <AdminActionTokenInput />
      <AdminCheckbox label="Enable Telegram payment notifications" name="isEnabled" defaultChecked={setting.isEnabled} />
      <AdminField label="Telegram chat ID" name="chatId" defaultValue={setting.chatId} />
      <AdminField label="Telegram bot token replacement" name="botToken" type="password" />
      <div className="rounded-md border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-6 text-orange-100">
        Bot token status: <strong>{setting.configured ? "configured" : "not configured"}</strong>. Stored tokens are encrypted and never displayed.
      </div>
      <div className="md:col-span-2">
        <AdminTextarea label="Message template" name="messageTemplate" defaultValue={setting.messageTemplate} required rows={5} />
      </div>
      <div className="md:col-span-2 rounded-md border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300">
        <p className="font-bold text-white">Available variables</p>
        <p className="mt-2 text-zinc-400">{telegramPaymentTemplateVariables.map((item) => `{${item}}`).join(", ")}</p>
      </div>
      <div className="md:col-span-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
        <p className="font-bold">Preview only</p>
        <p className="mt-2">{setting.preview}</p>
      </div>
      <p className="md:col-span-2 rounded-md border border-white/10 bg-black/20 p-3 text-sm leading-6 text-zinc-400">
        No Telegram messages are sent automatically in this stage. Mock payments and checkout sessions are not wired to notifications.
      </p>
      <div className="md:col-span-2">
        <AdminSubmitButton>Save notification settings</AdminSubmitButton>
      </div>
    </form>
  );
}
