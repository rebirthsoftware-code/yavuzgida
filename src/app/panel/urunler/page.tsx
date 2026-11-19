import { CatalogPage } from "@/components/catalog/CatalogPage";
import { products } from "@/lib/catalog";

export default function Page() {
  return <CatalogPage base="/panel" title="Tüm Ürünler" count={products.length} crumbs={[{ label: "Tüm Ürünler" }]} />;
}
