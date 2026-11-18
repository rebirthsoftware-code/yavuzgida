/**
 * Müşteri modu: "mevcut" (hâlihazırda çalışan müşteri: fiyatsız katalog, WhatsApp sipariş listesi)
 * veya "yeni" (fiyatlı alışveriş, online ödeme). localStorage'da tutulur.
 */
export type CustomerMode = "mevcut" | "yeni";
const KEY = "yavuz-mode-v1";

type State = { mode: CustomerMode | null; ready: boolean };
let state: State = { mode: null, ready: false };
const serverState: State = state;
const listeners = new Set<() => void>();
let bound = false;

const emit = () => listeners.forEach((l) => l());

function load() {
  let mode: CustomerMode | null = null;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "mevcut" || v === "yeni") mode = v;
  } catch {}
  state = { mode, ready: true };
  emit();
}

export const modeStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    if (!bound && typeof window !== "undefined") {
      bound = true;
      queueMicrotask(load);
    }
    return () => listeners.delete(l);
  },
  get: () => state,
  getServer: () => serverState,
  set(mode: CustomerMode | null) {
    state = { mode, ready: true };
    try {
      if (mode) localStorage.setItem(KEY, mode);
      else localStorage.removeItem(KEY);
    } catch {}
    emit();
  },
};
