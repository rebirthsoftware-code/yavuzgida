import { defaultState } from "./content-store";
import type { ContentState } from "@/lib/content";

export const CONTENT_TAG = "content";

/**
 * Statik dışa aktarım (GitHub Pages) için içerik yükleyici: veritabanı ve "use cache" yoktur,
 * derleme sırasında varsayılan içerik kullanılır. Pages iş akışı bu dosyayı content-cache.ts yerine koyar.
 */
export async function loadContent(): Promise<ContentState> {
  return defaultState;
}
