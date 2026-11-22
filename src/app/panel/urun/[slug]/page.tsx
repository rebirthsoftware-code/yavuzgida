import { Suspense } from "react";
import { notFound } from "next/navigation";
import { baseProducts, getProduct } from "@/lib/catalog";
import { ProductDetail } from "@/components/product/ProductDetail";

export function generateStaticParams() {
  return baseProducts.map((p) => ({ slug: p.slug }));
}

async function Content({ params }: Pick<PageProps<"/panel/urun/[slug]">, "params">) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  return <ProductDetail p={p} base="/panel" />;
}

export default function Page(props: PageProps<"/panel/urun/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1320px] px-4 py-6"><div className="h-80 animate-pulse rounded-xl bg-white" /></div>}>
      <Content params={props.params} />
    </Suspense>
  );
}
