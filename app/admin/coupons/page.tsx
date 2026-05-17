import { AdminComingSoonPage } from "@/components/admin/AdminComingSoonPage";
import { createAdminMetadata } from "@/lib/admin/metadata";

export const metadata = createAdminMetadata("Coupons");
export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  return (
    <AdminComingSoonPage
      title="Coupons"
      description="Coupon management is reserved for a later admin iteration."
      section="coupons"
    />
  );
}
