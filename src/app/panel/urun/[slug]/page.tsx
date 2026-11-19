import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/catalog";
import { ProductDetail } from "@/components/product/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: PageProps<"/panel/urun/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  return <ProductDetail p={p} base="/panel" />;
}
