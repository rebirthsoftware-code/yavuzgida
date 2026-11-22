import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Yavuz Gıda'nın 600'den fazla ürününü kategori, marka ve fiyata göre filtreleyin.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  return <CatalogPage title="Tüm Ürünler" count={products.length} crumbs={[{ label: "Tüm Ürünler" }]} />;
}
