import { db } from "@/server/db";
import { fail, guard, json } from "@/server/http";
import { site } from "@/lib/site";

/** Anlaşmalı müşteri sipariş fişini (PDF + kalemler) kaydeder; herkese açık PDF bağlantısı döner. */
export async function POST(req: Request) {
  return guard(async () => {
    const body = (await req.json().catch(() => null)) as { ref?: string; createdAt?: string; form?: Record<string, string>; items?: unknown[]; pdfBase64?: string } | null;
    if (!body?.ref || !/^YL-[A-Z0-9-]{6,20}$/.test(body.ref) || !body.pdfBase64 || !Array.isArray(body.items)) return fail("Geçersiz istek");
    if (body.pdfBase64.length > 4_000_000) return fail("PDF çok büyük");
    const c = await db();
    await c.execute({
      sql: `INSERT INTO panel_orders (ref, created_at, firm, name, phone, note, items_json, pdf_base64)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
            ON CONFLICT(ref) DO UPDATE SET items_json = excluded.items_json, pdf_base64 = excluded.pdf_base64, firm = excluded.firm, name = excluded.name, phone = excluded.phone, note = excluded.note`,
      args: [body.ref, body.createdAt ?? new Date().toISOString(), String(body.form?.firm ?? "").slice(0, 120), String(body.form?.name ?? "").slice(0, 80), String(body.form?.phone ?? "").slice(0, 20), String(body.form?.note ?? "").slice(0, 500), JSON.stringify(body.items).slice(0, 200_000), body.pdfBase64],
    });
    return json({ status: "success", url: `${site.url}/api/fis/${body.ref}` });
  });
}
