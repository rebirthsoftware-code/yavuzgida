import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Yavuz Gıda'nın 600'den fazla ürününü kategori, marka ve fiyata göre filtreleyin.",
};

export default function ProductsPage() {
  return <CatalogPage title="Fiyat listesi" description={`${products.length} ürün, katalog sırasında. Ambalaj boyunu satırda seçin, adet girin; sipariş listeniz sağda anında oluşur.`} crumbs={[{ label: "Tüm ürünler" }]} />;
}
