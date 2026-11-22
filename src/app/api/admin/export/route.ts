import { fail, isAdmin } from "@/server/http";
import { listAdminProducts } from "@/server/content-admin";
import { productsToCsv } from "@/lib/csv";

/** Tüm ürünleri (gizliler dâhil) CSV olarak indirir. */
export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  const items = await listAdminProducts();
  const csv = productsToCsv(items, new Set(items.filter((p) => p.hidden).map((p) => p.slug)));
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="yavuz-urunler-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
