import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Yavuz Gıda'nın 600'den fazla ürününü kategori, marka ve fiyata göre filtreleyin.",
};

export default function ProductsPage() {
  return <CatalogPage title="Tüm Ürünler" count={products.length} crumbs={[{ label: "Tüm Ürünler" }]} />;
}
