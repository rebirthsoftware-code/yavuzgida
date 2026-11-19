import { CART_KEY, type CartItem } from "./cart";

/**
 * Sepet deposu: bellek + localStorage. React tarafı useSyncExternalStore ile bağlanır;
 * sunucu/istemci uyumsuzluğu olmaz, sekmeler arası senkron kalır.
 * İki ayrı depo vardır: mağaza sepeti ve anlaşmalı müşteri paneli sipariş listesi.
 */
type State = { items: CartItem[]; ready: boolean };

export type CartStore = {
  key: string;
  subscribe(l: () => void): () => void;
  get: () => State;
  getServer: () => State;
  set(items: CartItem[]): void;
  clear(): void;
};

function createCartStore(key: string): CartStore {
  let state: State = { items: [], ready: false };
  const serverState: State = state;
  const listeners = new Set<() => void>();
  let bound = false;
  const emit = () => listeners.forEach((l) => l());
  const load = () => {
    let items: CartItem[] = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) items = JSON.parse(raw);
    } catch {}
    state = { items, ready: true };
    emit();
  };
  const store: CartStore = {
    key,
    subscribe(l) {
      listeners.add(l);
      if (!bound && typeof window !== "undefined") {
        bound = true;
        window.addEventListener("storage", (e) => e.key === key && load());
        queueMicrotask(load);
      }
      return () => {
        listeners.delete(l);
      };
    },
    get: () => state,
    getServer: () => serverState,
    set(items) {
      state = { items, ready: true };
      try {
        localStorage.setItem(key, JSON.stringify(items));
      } catch {}
      emit();
    },
    clear() {
      store.set([]);
    },
  };
  return store;
}

/** Mağaza sepeti */
export const cartStore = createCartStore(CART_KEY);
/** Anlaşmalı müşteri paneli sipariş listesi */
export const panelStore = createCartStore("yavuz-panel-list-v1");
