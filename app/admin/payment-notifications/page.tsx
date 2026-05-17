import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminPaymentNotificationSetting } from "@/lib/admin/repositories/payment-settings";
import { PaymentNotificationForm } from "@/app/admin/payment-notifications/PaymentNotificationForm";

export const metadata = createAdminMetadata("Payment Notifications");
export const dynamic = "force-dynamic";

export default async function AdminPaymentNotificationsPage() {
  const result = await getAdminPaymentNotificationSetting();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Payment Notifications</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Configure a Telegram payment notification template for future verified payment events. Current stage is preview-only.
          </p>
        </div>
        <div className="flex gap-2">
          <AdminStatusBadge tone={result.data.isEnabled ? "green" : "zinc"}>
            {result.data.isEnabled ? "Enabled" : "Disabled"}
          </AdminStatusBadge>
          <AdminStatusBadge tone={result.data.configured ? "green" : "orange"}>
            {result.data.configured ? "Token configured" : "Token missing"}
          </AdminStatusBadge>
        </div>
      </div>
      {!result.available ? (
        <AdminStatusNotice message="Database is unavailable. Telegram settings cannot be loaded or saved." />
      ) : (
        <PaymentNotificationForm setting={result.data} />
      )}
    </div>
  );
}
