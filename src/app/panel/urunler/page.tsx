import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getProducts } from "@/lib/catalog";

export default async function Page() {
  const products = await getProducts();
  return <CatalogPage base="/panel" title="Tüm Ürünler" count={products.length} crumbs={[{ label: "Tüm Ürünler" }]} />;
}
