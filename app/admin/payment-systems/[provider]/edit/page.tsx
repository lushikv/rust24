import { notFound } from "next/navigation";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { AdminStatusNotice } from "@/components/admin/AdminStatusNotice";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getAdminPaymentSystemFormData } from "@/lib/admin/repositories/payment-settings";
import { getPaymentProviderDefinition } from "@/lib/payments/provider-settings";
import { PaymentSystemForm } from "@/app/admin/payment-systems/PaymentSystemForm";

type PageProps = {
  params: Promise<{ provider: string }>;
};

export const metadata = createAdminMetadata("Edit Payment System");

export default async function EditPaymentSystemPage({ params }: PageProps) {
  const { provider } = await params;
  const definition = getPaymentProviderDefinition(provider);

  if (!definition) {
    notFound();
  }

  const result = await getAdminPaymentSystemFormData(provider);

  if (!result.available) {
    return <AdminStatusNotice message="Database is unavailable. Payment provider settings cannot be loaded." />;
  }

  return (
    <AdminFormShell
      title={`Edit ${definition.displayName}`}
      description="OWNER-only secret configuration for future payment provider integration."
      backHref="/admin/payment-systems"
    >
      <PaymentSystemForm definition={definition} setting={{ ...result.data, displayName: result.data.displayName || definition.displayName }} />
    </AdminFormShell>
  );
}
