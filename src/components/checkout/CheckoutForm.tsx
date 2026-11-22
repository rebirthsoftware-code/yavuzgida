"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Banknote, CreditCard, Loader2, Lock, AlertCircle } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { PackArt } from "@/components/product/PackArt";
import { checkoutSchema, cities, buildOrderRecord, computeCartTotals, type CheckoutInput, type PaymentMethod } from "@/lib/order";
import { saveLastOrder } from "@/lib/last-order";
import { paytrEnabled } from "@/lib/paytr";
import { apiEnabled, createRemoteOrder } from "@/lib/api";
import { whatsappUrl } from "@/lib/forms";
import { formatPrice, cn } from "@/lib/format";
import { site } from "@/lib/site";
import { useSiteConfig } from "@/components/config/ConfigProvider";
import { MessageCircle } from "lucide-react";

type FormState = Omit<CheckoutInput, "items" | "acceptTerms" | "acceptKvkk"> & {
  acceptTerms: boolean;
  acceptKvkk: boolean;
};

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  district: "",
  city: "",
  postalCode: "",
  note: "",
  invoiceType: "bireysel",
  companyName: "",
  taxOffice: "",
  taxNo: "",
  paymentMethod: "havale",
  acceptTerms: false,
  acceptKvkk: false,
};

const inputCls =
  "h-11 w-full rounded-lg border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 aria-[invalid=true]:border-red-600";

function Field({
  name,
  label,
  children,
  hint,
  className,
  errors,
}: {
  name: keyof FormState;
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
  errors: Record<string, string>;
}) {
  return (
    <div className={className} id={`f-${name}`}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink-900">
        {label}
      </label>
      {children}
      {errors[name] ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600" role="alert">
          <AlertCircle className="h-3.5 w-3.5" /> {errors[name]}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}

function PaymentIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />;
}

const PAYMENTS: { id: PaymentMethod; title: string; text: string; icon: React.ElementType; disabled: boolean; extra?: string }[] = [
  {
    id: "havale",
    title: "Havale / EFT",
    text: "Sipariş sonrası IBAN bilgileri gösterilir. Ödeme onaylandığında kargoya verilir.",
    icon: Banknote,
    disabled: false,
  },
  {
    id: "kart",
    title: "Kredi / Banka kartı",
    text: paytrEnabled() ? "PayTR güvencesiyle 3D Secure ödeme. Tüm kartlar ve taksit seçenekleri." : "Çok yakında.",
    icon: CreditCard,
    disabled: !paytrEnabled(),
    extra: paytrEnabled() ? "PayTR" : undefined,
  },
];

export function CheckoutForm() {
  const router = useRouter();
  const { items: cartItems, ready: hydrated, clear } = useCart();
  const lines = useMemo(() => cartItems.filter((i) => !i.custom), [cartItems]);
  const customItems = useMemo(() => cartItems.filter((i) => i.custom), [cartItems]);
  const items = useMemo(() => lines.map((l) => ({ productSlug: l.slug, variantId: l.variantId, quantity: l.qty })), [lines]);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { commerce, discountTiers } = useSiteConfig();
  const rules = useMemo(() => ({ freeShippingThreshold: commerce.freeShippingThreshold, shippingFee: commerce.shippingFee, cardPayments: commerce.cardPayments, discountTiers }), [commerce, discountTiers]);
  const totals = useMemo(() => computeCartTotals(lines, rules), [lines, rules]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const payload = { ...form, items };
    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      document.getElementById(`f-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    const order = buildOrderRecord(parsed.data, cartItems, rules);
    if ("error" in order) {
      setServerError(order.error);
      setSubmitting(false);
      return;
    }

    // Sipariş API'si tanımlıysa sipariş sunucuya yazılır (yönetim paneli + takip); kartta PayTR token'ı da gelir.
    if (apiEnabled()) {
      const res = await createRemoteOrder(order);
      if (res.status !== "success" || !res.orderNo) {
        if (res.reason === "Sunucuya ulaşılamadı" && order.paymentMethod === "havale") {
          // Statik demo ortamı: sipariş kaydı yok, özet WhatsApp ile iletilir
          saveLastOrder({ ...order, delivered: false });
          clear();
          router.push(`/siparis-alindi?no=${encodeURIComponent(order.orderNo)}`);
          return;
        }
        setServerError(res.reason ?? "Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
        setSubmitting(false);
        return;
      }
      const synced = { ...order, orderNo: res.orderNo, totals: { ...order.totals, ...res.totals } };
      if (order.paymentMethod === "kart") {
        if (!res.token && !res.demo) {
          setServerError("Kart ödemesi başlatılamadı. Lütfen tekrar deneyin veya başka bir yöntem seçin.");
          setSubmitting(false);
          return;
        }
        saveLastOrder({ ...synced, paytr: { token: res.token ?? "", merchantOid: res.merchantOid, demo: res.demo } });
        router.push("/odeme/kart");
        return;
      }
      saveLastOrder({ ...synced, delivered: true });
      clear();
      router.push(`/siparis-alindi?no=${encodeURIComponent(res.orderNo)}`);
      return;
    }
    if (order.paymentMethod === "kart") {
      setServerError("Kart ödemesi henüz aktif değil. Lütfen başka bir yöntem seçin.");
      setSubmitting(false);
      return;
    }

    // Sipariş API'si yoksa (statik demo): özet WhatsApp ile iletilir.
    saveLastOrder({ ...order, delivered: false });
    clear();
    router.push(`/siparis-alindi?no=${encodeURIComponent(order.orderNo)}`);
  };

  if (!hydrated) return <div className="h-64 animate-pulse rounded-xl bg-paper-100" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center">
        {customItems.length > 0 && (
          <p className="mb-4 rounded-lg bg-orange-50 p-3 text-sm text-ink-800">
            Sepetinizde yalnızca özel harman var. Özel harman siparişleri teklif sürecinden geçer; lütfen{" "}
            <a href={whatsappUrl(`Özel harman talebi: ${customItems.map((c) => `${c.brand} ${c.name} ${c.variantLabel} × ${c.qty} (${c.custom})`).join(" | ")}`)} target="_blank" rel="noopener" className="font-semibold text-orange-600 underline">
              WhatsApp üzerinden
            </a>{" "}
            iletin.
          </p>
        )}
        <h2 className="text-2xl font-semibold text-ink-900">Sepetiniz boş</h2>
        <p className="mt-2 text-sm text-ink-500">Ödeme için önce sepetinize ürün ekleyin.</p>
        <Link href="/urunler" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink-900 px-7 text-sm font-semibold text-white">
          Ürünlere git
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-7">
        {/* İletişim */}
        <section className="rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-ink-900">1. İletişim bilgileri</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field errors={errors} name="fullName" label="Ad Soyad" className="sm:col-span-2">
              <input id="fullName" autoComplete="name" className={inputCls} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} aria-invalid={!!errors.fullName} />
            </Field>
            <Field errors={errors} name="email" label="E-posta">
              <input id="email" type="email" autoComplete="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} />
            </Field>
            <Field errors={errors} name="phone" label="Cep telefonu" hint="Kargo bilgilendirmesi için">
              <input id="phone" type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} />
            </Field>
          </div>
        </section>

        {/* Teslimat */}
        <section className="rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-ink-900">2. Teslimat adresi</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field errors={errors} name="address" label="Adres" className="sm:col-span-2">
              <textarea id="address" autoComplete="street-address" rows={3} className={cn(inputCls, "h-auto py-3")} value={form.address} onChange={(e) => set("address", e.target.value)} aria-invalid={!!errors.address} placeholder="Mahalle, sokak, bina no, daire" />
            </Field>
            <Field errors={errors} name="city" label="İl">
              <select id="city" autoComplete="address-level1" className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} aria-invalid={!!errors.city}>
                <option value="">Seçin</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field errors={errors} name="district" label="İlçe">
              <input id="district" autoComplete="address-level2" className={inputCls} value={form.district} onChange={(e) => set("district", e.target.value)} aria-invalid={!!errors.district} />
            </Field>
            <Field errors={errors} name="postalCode" label="Posta kodu (isteğe bağlı)">
              <input id="postalCode" autoComplete="postal-code" inputMode="numeric" className={inputCls} value={form.postalCode ?? ""} onChange={(e) => set("postalCode", e.target.value)} />
            </Field>
            <Field errors={errors} name="note" label="Sipariş notu (isteğe bağlı)">
              <input id="note" className={inputCls} value={form.note ?? ""} onChange={(e) => set("note", e.target.value)} placeholder="Kapıcıya bırakılabilir vb." />
            </Field>
          </div>
        </section>

        {/* Fatura */}
        <section className="rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-ink-900">3. Fatura bilgileri</h2>
          <div className="mt-4 flex gap-2">
            {(["bireysel", "kurumsal"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("invoiceType", t)}
                className={cn(
                  "h-11 rounded-full border px-5 text-sm font-semibold transition-colors",
                  form.invoiceType === t ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 hover:border-ink-900",
                )}
                aria-pressed={form.invoiceType === t}
              >
                {t === "bireysel" ? "Bireysel" : "Kurumsal"}
              </button>
            ))}
          </div>
          {form.invoiceType === "kurumsal" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field errors={errors} name="companyName" label="Firma unvanı" className="sm:col-span-2">
                <input id="companyName" autoComplete="organization" className={inputCls} value={form.companyName ?? ""} onChange={(e) => set("companyName", e.target.value)} aria-invalid={!!errors.companyName} />
              </Field>
              <Field errors={errors} name="taxOffice" label="Vergi dairesi">
                <input id="taxOffice" className={inputCls} value={form.taxOffice ?? ""} onChange={(e) => set("taxOffice", e.target.value)} aria-invalid={!!errors.taxOffice} />
              </Field>
              <Field errors={errors} name="taxNo" label="Vergi numarası">
                <input id="taxNo" inputMode="numeric" className={inputCls} value={form.taxNo ?? ""} onChange={(e) => set("taxNo", e.target.value)} aria-invalid={!!errors.taxNo} />
              </Field>
            </div>
          )}
        </section>

        {/* Ödeme */}
        <section className="rounded-xl border border-ink-200 bg-white p-6" id="f-paymentMethod">
          <h2 className="text-xl font-semibold text-ink-900">4. Ödeme yöntemi</h2>
          <div className="mt-5 space-y-3">
            {PAYMENTS.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors",
                  form.paymentMethod === p.id ? "border-orange-500 bg-orange-50" : "border-ink-200 hover:border-ink-400",
                  p.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={p.id}
                  checked={form.paymentMethod === p.id}
                  disabled={p.disabled}
                  onChange={() => set("paymentMethod", p.id)}
                  className="mt-1 h-4 w-4 accent-orange-600"
                />
                <PaymentIcon icon={p.icon} />
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-ink-900">{p.title}</span>
                    {p.extra && <span className="text-xs font-semibold text-ink-500">{p.extra}</span>}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-700">{p.text}</span>
                </span>
              </label>
            ))}
          </div>
          {form.paymentMethod === "havale" && (
            <div className="mt-4 rounded-xl bg-paper-50 p-4 text-sm text-ink-700">
              <p className="font-semibold text-ink-900">Havale/EFT bilgileri</p>
              <p className="mt-1">{site.bank.bankName} · {site.bank.holder}</p>
              <p className="font-mono text-xs">{site.bank.iban}</p>
              <p className="mt-1 text-xs">Açıklama kısmına sipariş numaranızı yazmayı unutmayın. Ödeme 1 iş günü içinde kontrol edilir.</p>
            </div>
          )}
        </section>

        {/* Onaylar */}
        <section className="space-y-3" id="f-acceptTerms">
          <label className="flex items-start gap-3 text-sm text-ink-800">
            <input type="checkbox" checked={form.acceptTerms} onChange={(e) => set("acceptTerms", e.target.checked)} className="mt-1 h-4 w-4 accent-orange-600" />
            <span>
              <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="font-semibold underline underline-offset-2">
                Mesafeli Satış Sözleşmesi
              </Link>
              &apos;ni ve{" "}
              <Link href="/on-bilgilendirme-formu" target="_blank" className="font-semibold underline underline-offset-2">
                Ön Bilgilendirme Formu
              </Link>
              &apos;nu okudum, onaylıyorum.
            </span>
          </label>
          {errors.acceptTerms && <p className="text-xs font-semibold text-red-600">{errors.acceptTerms}</p>}
          <label className="flex items-start gap-3 text-sm text-ink-800" id="f-acceptKvkk">
            <input type="checkbox" checked={form.acceptKvkk} onChange={(e) => set("acceptKvkk", e.target.checked)} className="mt-1 h-4 w-4 accent-orange-600" />
            <span>
              <Link href="/kvkk" target="_blank" className="font-semibold underline underline-offset-2">
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni okudum; kişisel verilerimin sipariş süreci için işlenmesini kabul ediyorum.
            </span>
          </label>
          {errors.acceptKvkk && <p className="text-xs font-semibold text-red-600">{errors.acceptKvkk}</p>}
        </section>
      </div>

      {/* Özet */}
      <aside className="lg:col-span-5">
        <div className="sticky top-28 rounded-xl border border-ink-200 bg-paper-50 p-6">
          <h2 className="text-xl font-semibold text-ink-900">Sipariş özeti</h2>
          <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
            {lines.map((l) => (
              <li key={`${l.slug}-${l.variantId}`} className="flex items-center gap-3">
                <span className="grid h-16 w-14 shrink-0 place-items-center rounded-lg bg-paper-50">
                  <PackArt art={l.art} hue={l.hue} name={l.name} brand={l.brand} className="h-14" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {l.brand} {l.name}
                  </p>
                  <p className="text-xs text-ink-500">
                    {l.variantLabel} × {l.qty}
                  </p>
                </div>
                <p className="text-sm font-bold tabular-nums">{formatPrice(l.price * l.qty)}</p>
              </li>
            ))}
            {customItems.length > 0 && (
              <li className="rounded-lg bg-orange-50 p-3 text-xs text-ink-800">
                <b>{customItems.length} özel harman kalemi</b> bu siparişe dahil edilmez; teklif için{" "}
                <a href={whatsappUrl(`Özel harman talebi: ${customItems.map((c) => `${c.brand} ${c.name} ${c.variantLabel} × ${c.qty} (${c.custom})`).join(" | ")}`)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-orange-600 underline">
                  <MessageCircle className="size-3" /> WhatsApp
                </a>{" "}
                ile iletin.
              </li>
            )}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-ink-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-700">Ara toplam</dt>
              <dd className="font-semibold tabular-nums">{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-700">Kargo</dt>
              <dd className="font-semibold tabular-nums">{totals.shipping === 0 ? "Ücretsiz" : formatPrice(totals.shipping)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <dt>Sepet indirimi</dt>
                <dd className="font-semibold tabular-nums">-{formatPrice(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-ink-200 pt-3 text-lg">
              <dt className="font-bold text-ink-900">Toplam</dt>
              <dd className="font-bold tabular-nums text-ink-900">{formatPrice(totals.total)}</dd>
            </div>
          </dl>
          {serverError && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-100 p-3 text-sm font-semibold text-red-600" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {serverError}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink-900 text-base font-bold text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
            {submitting ? (form.paymentMethod === "kart" ? "Ödeme sayfası açılıyor…" : "Sipariş oluşturuluyor…") : form.paymentMethod === "kart" ? "Güvenli ödemeye geç" : "Siparişi tamamla"}
          </button>
          <p className="mt-3 text-center text-xs text-ink-500">
            Siparişi tamamlayarak ödeme yükümlülüğü altına girdiğinizi kabul edersiniz.
          </p>
        </div>
      </aside>
    </form>
  );
}
