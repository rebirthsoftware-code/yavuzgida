import { getPanelOrder, updatePanelOrder } from "@/server/panel-orders";
import { fail, guard, isAdmin, json } from "@/server/http";

export async function GET(req: Request, ctx: { params: Promise<{ ref: string }> }) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const { ref } = await ctx.params;
    const order = await getPanelOrder(ref);
    return order ? json({ status: "success", order }) : fail("Fiş bulunamadı", 404);
  });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ ref: string }> }) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const { ref } = await ctx.params;
    const body = (await req.json().catch(() => ({}))) as { status?: string; adminNote?: string };
    const res = await updatePanelOrder(ref, body);
    if (!res.ok) return fail(res.reason, res.status);
    return json({ status: "success", order: res.order });
  });
}
