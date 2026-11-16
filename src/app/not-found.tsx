import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-black text-paper-200">404</p>
      <h1 className="mt-2 text-2xl font-bold">Sayfa bulunamadı</h1>
      <p className="mt-2 text-ink-500">Aradığınız ürün veya sayfa taşınmış ya da kaldırılmış olabilir.</p>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/">Ana sayfa</ButtonLink>
        <ButtonLink href="/urunler" variant="outline">Tüm ürünler</ButtonLink>
      </div>
    </div>
  );
}
