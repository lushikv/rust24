import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ productId: string }> };

export default async function ProductDetailRedirect({ params }: PageProps) {
  const { productId } = await params;
  redirect(`/admin/products/${productId}/edit`);
}
