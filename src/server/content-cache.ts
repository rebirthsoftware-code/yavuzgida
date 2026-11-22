import { cacheLife, cacheTag } from "next/cache";
import { readContentState } from "./content-store";
import type { ContentState } from "@/lib/content";

export const CONTENT_TAG = "content";

/**
 * Yayınlanan içerik (ayarlar + ürünler). Veritabanı tanımlıysa oradan okunur ve
 * yönetim panelinden bir değişiklik gelene dek önbellekte kalır (bkz. `invalidateContent`).
 * Veritabanı yoksa (statik demo) varsayılanlar döner.
 */
export async function loadContent(): Promise<ContentState> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  return readContentState();
}
