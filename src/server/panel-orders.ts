import type { InValue, Row } from "@libsql/client";
import { db } from "./db";
import { panelStatuses, type PanelApiOrder, type PanelStatus } from "@/lib/api";
import { site } from "@/lib/site";

const now = () => new Date().toISOString();

function rowToPanelOrder(r: Row): PanelApiOrder {
  let items: PanelApiOrder["items"] = [];
  try {
    items = JSON.parse(String(r.items_json)) as PanelApiOrder["items"];
  } catch {}
  const status = (panelStatuses as readonly string[]).includes(String(r.status)) ? (String(r.status) as PanelStatus) : "yeni";
  return {
    ref: String(r.ref),
    createdAt: String(r.created_at),
    updatedAt: r.updated_at ? String(r.updated_at) : String(r.created_at),
    status,
    firm: String(r.firm ?? ""),
    name: r.name ? String(r.name) : "",
    phone: String(r.phone ?? ""),
    note: r.note ? String(r.note) : "",
    adminNote: r.admin_note ? String(r.admin_note) : "",
    items,
    totalQty: items.reduce((s, it) => s + (Number(it.qty) || 0), 0),
    pdfUrl: `${site.url}/api/fis/${String(r.ref)}`,
  };
}

const COLS = "ref, created_at, updated_at, status, firm, name, phone, note, admin_note, items_json";

export async function listPanelOrders(params: { status?: string | null; q?: string | null; page?: number }) {
  const client = await db();
  const size = 30;
  const page = Math.max(1, params.page || 1);
  const where: string[] = [];
  const args: InValue[] = [];
  if (params.status && (panelStatuses as readonly string[]).includes(params.status)) {
    where.push(`status = ?${args.length + 1}`);
    args.push(params.status);
  }
  if (params.q?.trim()) {
    const i = args.length + 1;
    where.push(`(ref LIKE ?${i} OR firm LIKE ?${i} OR name LIKE ?${i} OR phone LIKE ?${i})`);
    args.push(`%${params.q.trim()}%`);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = Number((await client.execute({ sql: `SELECT COUNT(*) AS n FROM panel_orders ${w}`, args })).rows[0]?.n ?? 0);
  const rows = await client.execute({ sql: `SELECT ${COLS} FROM panel_orders ${w} ORDER BY created_at DESC LIMIT ${size} OFFSET ${(page - 1) * size}`, args });
  return { page, pages: Math.max(1, Math.ceil(total / size)), total, orders: rows.rows.map(rowToPanelOrder) };
}

export async function getPanelOrder(ref: string): Promise<PanelApiOrder | null> {
  const client = await db();
  const r = await client.execute({ sql: `SELECT ${COLS} FROM panel_orders WHERE ref = ?1`, args: [ref.toUpperCase()] });
  return r.rows[0] ? rowToPanelOrder(r.rows[0]) : null;
}

export async function panelStats() {
  const client = await db();
  const byStatus = (await client.execute("SELECT status, COUNT(*) AS n FROM panel_orders GROUP BY status")).rows.map((r) => ({ status: (String(r.status) || "yeni") as PanelStatus, n: Number(r.n) }));
  const today = new Date().toISOString().slice(0, 10);
  const count = async (since: string) => Number((await client.execute({ sql: "SELECT COUNT(*) AS n FROM panel_orders WHERE created_at >= ?1 AND status != 'iptal'", args: [since] })).rows[0]?.n ?? 0);
  return { byStatus, today: await count(today), month: await count(today.slice(0, 7) + "-01") };
}

export async function updatePanelOrder(ref: string, patch: { status?: string; adminNote?: string }): Promise<{ ok: true; order: PanelApiOrder } | { ok: false; status: number; reason: string }> {
  const current = await getPanelOrder(ref);
  if (!current) return { ok: false, status: 404, reason: "Fiş bulunamadı" };
  const sets: string[] = [];
  const args: InValue[] = [];
  if (patch.status !== undefined) {
    if (!(panelStatuses as readonly string[]).includes(patch.status)) return { ok: false, status: 400, reason: "Geçersiz durum" };
    sets.push(`status = ?${args.length + 1}`);
    args.push(patch.status);
  }
  if (patch.adminNote !== undefined) {
    sets.push(`admin_note = ?${args.length + 1}`);
    args.push(String(patch.adminNote).slice(0, 1000));
  }
  if (!sets.length) return { ok: true, order: current };
  sets.push(`updated_at = ?${args.length + 1}`);
  args.push(now());
  args.push(current.ref);
  const client = await db();
  await client.execute({ sql: `UPDATE panel_orders SET ${sets.join(", ")} WHERE ref = ?${args.length}`, args });
  return { ok: true, order: (await getPanelOrder(current.ref))! };
}
