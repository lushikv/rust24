import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

export type AdminPopularProductView = {
  productTitle: string;
  productSlug: string;
  quantity: number;
  totalRub: number;
} | null;

export function AdminPopularProductCard({
  title,
  product
}: {
  title: string;
  product: AdminPopularProductView;
}) {
  if (!product) {
    return (
      <AdminEmptyState
        title={title}
        description="Product ranking will be available after verified successful payments exist."
      />
    );
  }

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">{title}</p>
      <h3 className="mt-3 text-xl font-black text-white">{product.productTitle}</h3>
      <dl className="mt-4 grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
        <div>
          <dt>Quantity</dt>
          <dd className="mt-1 font-black text-white">{product.quantity}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd className="mt-1 font-black text-white">{product.totalRub} RUB</dd>
        </div>
      </dl>
    </article>
  );
}
