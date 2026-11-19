import { db } from "@/server/db";

/** Kayıtlı sipariş fişini PDF olarak sunar (WhatsApp mesajındaki bağlantı). */
export async function GET(_req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const { ref } = await ctx.params;
  const clean = ref.replace(/\.pdf$/i, "").toUpperCase();
  try {
    const c = await db();
    const r = await c.execute({ sql: "SELECT pdf_base64 FROM panel_orders WHERE ref = ?1", args: [clean] });
    const b64 = r.rows[0]?.pdf_base64;
    if (!b64) return new Response("Fiş bulunamadı", { status: 404 });
    const bytes = Buffer.from(String(b64), "base64");
    return new Response(bytes, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="YavuzGida-Siparis-${clean}.pdf"`, "Cache-Control": "private, max-age=3600" } });
  } catch {
    return new Response("Sunucu hatası", { status: 500 });
  }
}
