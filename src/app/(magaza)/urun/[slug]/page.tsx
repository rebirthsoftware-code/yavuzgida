import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { baseProducts, getProduct } from "@/lib/catalog";
import { ProductDetail } from "@/components/product/ProductDetail";

export function generateStaticParams() {
  return baseProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/urun/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return { title: `${p.brand} ${p.name} ${p.variants[0].label} Fiyatı`, description: p.description };
}

async function Content({ params }: Pick<PageProps<"/urun/[slug]">, "params">) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  return <ProductDetail p={p} />;
}

export default function ProductPage(props: PageProps<"/urun/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1320px] px-4 py-6"><div className="h-80 animate-pulse rounded-xl bg-white" /></div>}>
      <Content params={props.params} />
    </Suspense>
  );
}
