import { listPanelOrders, panelStats } from "@/server/panel-orders";
import { fail, guard, isAdmin, json } from "@/server/http";

/** Anlaşmalı müşteri fişleri (yönetim). */
export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const url = new URL(req.url);
    const [data, stats] = await Promise.all([
      listPanelOrders({ status: url.searchParams.get("status"), q: url.searchParams.get("q"), page: Number(url.searchParams.get("page")) || 1 }),
      panelStats(),
    ]);
    return json({ status: "success", ...data, stats });
  });
}
