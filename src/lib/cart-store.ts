import { CART_KEY, type CartItem } from "./cart";

/**
 * Sepet deposu: bellek + localStorage. React tarafı useSyncExternalStore ile bağlanır;
 * böylece sunucu/istemci uyumsuzluğu olmaz ve sekmeler arası senkron kalır.
 */
type State = { items: CartItem[]; ready: boolean };

let state: State = { items: [], ready: false };
const serverState: State = state;
const listeners = new Set<() => void>();
let bound = false;

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state.items));
  } catch {}
}

function load() {
  let items: CartItem[] = [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) items = JSON.parse(raw);
  } catch {}
  state = { items, ready: true };
  emit();
}

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) load();
  });
  // İlk aboneliğin hemen ardından hidrasyon dışında yükle
  queueMicrotask(load);
}

export const cartStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    bind();
    return () => listeners.delete(l);
  },
  get: () => state,
  getServer: () => serverState,
  clear() {
    this.set([]);
  },
  set(items: CartItem[]) {
    state = { items, ready: true };
    persist();
    emit();
  },
};
