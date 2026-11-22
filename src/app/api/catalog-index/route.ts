import { getCatalog } from "@/lib/catalog";

/** Yayınlanan hafif ürün dizini (arama ve liste filtreleri için; yönetim değişikliklerini içerir). */
export async function GET() {
  const { index } = await getCatalog();
  return Response.json({ status: "success", index }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } });
}
