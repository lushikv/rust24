import { AdminComingSoonPage } from "@/components/admin/AdminComingSoonPage";
import { createAdminMetadata } from "@/lib/admin/metadata";

export const metadata = createAdminMetadata("Sales");
export const dynamic = "force-dynamic";

export default async function AdminSalesPage() {
  return (
    <AdminComingSoonPage
      title="Sales"
      description="Sale campaigns and discount scheduling are reserved for a later admin iteration."
      section="sales"
    />
  );
}
