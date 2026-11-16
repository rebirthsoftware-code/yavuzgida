import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Yavuz Gıda'nın 600'den fazla ürününü kategori, marka ve fiyata göre filtreleyin.",
};

export default function ProductsPage() {
  return <CatalogPage title="Tüm ürünler" description={`${products.length} ürün; kategori, marka, etiket ve fiyata göre filtreleyin. Arama kutusuna ürün adı veya marka yazabilirsiniz.`} crumbs={[{ label: "Ürünler" }]} />;
}
