import { fail, guard, isAdmin, json } from "@/server/http";
import { readContentState, writeConfig } from "@/server/content-store";
import { invalidateContent } from "@/server/content-admin";
import type { SiteConfig } from "@/lib/content";

export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => json({ status: "success", config: (await readContentState()).config }));
}

/** Kısmi güncelleme: yalnızca gönderilen bölümler değişir. */
export async function PUT(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const body = (await req.json().catch(() => null)) as Partial<SiteConfig> | null;
    if (!body || typeof body !== "object") return fail("Geçersiz istek");
    const config = await writeConfig(body);
    invalidateContent();
    return json({ status: "success", config });
  });
}
