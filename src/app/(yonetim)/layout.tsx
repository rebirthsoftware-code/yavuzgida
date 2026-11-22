import { CartProvider } from "@/components/cart/CartProvider";

/** Yönetim paneli kabuğu: mağaza başlığı/alt menüsü olmadan sade ekran. */
export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <main className="min-h-screen bg-paper-50">{children}</main>
    </CartProvider>
  );
}
