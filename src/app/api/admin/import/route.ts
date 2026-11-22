import { fail, guard, isAdmin, json } from "@/server/http";
import { listAdminProducts, invalidateContent } from "@/server/content-admin";
import { writeCustom, writePatch } from "@/server/content-store";
import { parseCsv, rowsToImport } from "@/lib/csv";

/** CSV içe aktarma: gövde düz metin (text/csv) veya { csv: string }. */
export async function POST(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const ct = req.headers.get("content-type") ?? "";
    const text = ct.includes("application/json") ? String(((await req.json().catch(() => ({}))) as { csv?: string }).csv ?? "") : await req.text();
    if (!text.trim()) return fail("Boş dosya");
    if (text.length > 5_000_000) return fail("Dosya çok büyük (5 MB sınırı)");
    const rows = parseCsv(text);
    if (!rows.length) return fail("Satır bulunamadı; ilk satır başlık olmalı");
    const known = new Set((await listAdminProducts()).map((p) => p.slug));
    const { patches, customs, errors } = rowsToImport(rows, known);
    for (const c of customs) await writeCustom(c);
    for (const [slug, patch] of Object.entries(patches)) await writePatch(slug, patch);
    invalidateContent();
    return json({ status: "success", updated: Object.keys(patches).length, created: customs.length, errors });
  });
}
