import { fail, guard, isAdmin, json } from "@/server/http";
import { listAdminProducts, invalidateContent } from "@/server/content-admin";
import { removeProductRow, writeCustom, writePatch } from "@/server/content-store";
import type { ProductPatch } from "@/lib/content";
import type { Product } from "@/lib/types";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, ctx: Ctx) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const { slug } = await ctx.params;
    const p = (await listAdminProducts()).find((x) => x.slug === slug);
    return p ? json({ status: "success", product: p }) : fail("Ürün bulunamadı", 404);
  });
}

/** Yama: temel ürün için fark kaydı; yönetimde eklenen ürün için tam kaydı günceller. */
export async function PATCH(req: Request, ctx: Ctx) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const { slug } = await ctx.params;
    const body = (await req.json().catch(() => null)) as (ProductPatch & { full?: Product }) | null;
    if (!body) return fail("Geçersiz istek");
    const existing = (await listAdminProducts()).find((x) => x.slug === slug);
    if (!existing) return fail("Ürün bulunamadı", 404);
    if (existing.custom && body.full) {
      await writeCustom({ ...body.full, slug });
      if (body.hidden !== undefined) await writePatch(slug, { hidden: body.hidden });
    } else {
      const { full: _f, ...patch } = body;
      void _f;
      await writePatch(slug, patch);
    }
    invalidateContent();
    const updated = (await listAdminProducts()).find((x) => x.slug === slug);
    return json({ status: "success", product: updated });
  });
}

/** Temel üründe yamayı siler (varsayılana döner); eklenen ürünü kaldırır. */
export async function DELETE(req: Request, ctx: Ctx) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const { slug } = await ctx.params;
    await removeProductRow(slug);
    invalidateContent();
    return json({ status: "success" });
  });
}
