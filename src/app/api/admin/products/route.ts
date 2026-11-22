import { fail, guard, isAdmin, json } from "@/server/http";
import { listAdminProducts, invalidateContent } from "@/server/content-admin";
import { writeCustom } from "@/server/content-store";
import { CUSTOM_PREFIX, slugify } from "@/lib/content";
import type { Product } from "@/lib/types";

/** Yönetim: ürün listesi (gizliler dâhil) ve yeni ürün ekleme. */
export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
    const cat = url.searchParams.get("kategori") ?? "";
    const only = url.searchParams.get("filtre") ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const size = 40;
    let items = await listAdminProducts();
    if (cat) items = items.filter((p) => p.category === cat);
    if (only === "gizli") items = items.filter((p) => p.hidden);
    if (only === "stoksuz") items = items.filter((p) => !p.variants.some((v) => v.inStock));
    if (only === "duzenlenen") items = items.filter((p) => p.patched || p.custom);
    if (only === "yeni") items = items.filter((p) => p.custom);
    if (q) items = items.filter((p) => [p.name, p.brand, p.slug, ...p.variants.map((v) => v.sku)].some((s) => s.toLowerCase().includes(q)));
    const total = items.length;
    return json({ status: "success", total, page, pages: Math.max(1, Math.ceil(total / size)), products: items.slice((page - 1) * size, page * size) });
  });
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const body = (await req.json().catch(() => null)) as Partial<Product> | null;
    if (!body?.name || !body.category || !Array.isArray(body.variants) || !body.variants.length) return fail("Ad, kategori ve en az bir varyant gerekli");
    const slug = CUSTOM_PREFIX + slugify(body.slug || `${body.brand ?? ""} ${body.name}`);
    const product: Product = {
      slug,
      name: body.name,
      brand: body.brand || "Yavuz Gıda",
      art: body.art ?? "box",
      rating: 0,
      reviews: 0,
      sold: 0,
      category: body.category,
      subcategory: body.subcategory ?? "",
      short: body.short || body.name,
      description: body.description || body.short || body.name,
      tags: body.tags ?? [],
      variants: body.variants.map((v, k) => ({ id: v.id || `v${k + 1}`, label: v.label || `Seçenek ${k + 1}`, sku: v.sku || `YVZ-${slugify(body.name!).toUpperCase().slice(0, 9)}-${k + 1}`, price: Number(v.price) || 0, oldPrice: v.oldPrice ? Number(v.oldPrice) : undefined, amount: Number(v.amount) || 1, amountUnit: v.amountUnit ?? "adet", inStock: v.inStock !== false, caseQty: v.caseQty ? Number(v.caseQty) : undefined })),
      specs: body.specs ?? [],
      hue: typeof body.hue === "number" ? body.hue : 30,
      popularity: 50,
      createdAt: new Date().toISOString().slice(0, 10),
      ...(body.image ? { image: body.image } : {}),
    };
    const saved = await writeCustom(product);
    invalidateContent();
    return json({ status: "success", product: saved });
  });
}
