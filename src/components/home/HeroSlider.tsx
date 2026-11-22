"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { splitHighlight, type HeroAccent, type HeroSlideCfg } from "@/lib/content";
import { useSiteConfig } from "@/components/config/ConfigProvider";
import { ChevronLeft, ChevronRight, ArrowRight, Coffee, BadgePercent, CakeSlice, Sparkles, Store, Truck, Clock, Package, FileText, MessageCircle, Leaf, Snowflake } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const AUTOPLAY_MS = 7000;

type Slide = {
  key: string;
  img: string;
  alt: string;
  icon: ReactNode;
  tab: string;
  tabSub: string;
  kicker: string;
  title: ReactNode;
  text: string;
  chips: { icon: ReactNode; text: string }[];
  cta: { label: string; href: string };
  alt2?: { label: string; href: string };
  accent: string;
  ctaCls: string;
  pos?: string;
};

const ACCENT: Record<HeroAccent, { text: string; cta: string }> = {
  gold: { text: "text-gold-400", cta: "bg-gold text-coal-950 hover:brightness-105" },
  orange: { text: "text-orange-400", cta: "bg-orange-500 text-white hover:bg-orange-600" },
  pink: { text: "text-pink-300", cta: "bg-white text-ink-900 hover:bg-pink-50" },
  sky: { text: "text-sky-300", cta: "bg-white text-ink-900 hover:bg-sky-50" },
};
const ICONS: Record<string, ReactNode> = {
  kahve: <Coffee className="size-4" />,
  firsat: <BadgePercent className="size-4" />,
  pasta: <CakeSlice className="size-4" />,
  harman: <Sparkles className="size-4" />,
  panel: <Store className="size-4" />,
};
const CHIP_ICONS = [<Coffee key="a" className="size-3.5" />, <Clock key="b" className="size-3.5" />, <BadgePercent key="c" className="size-3.5" />, <Truck key="d" className="size-3.5" />, <Package key="e" className="size-3.5" />, <Snowflake key="f" className="size-3.5" />, <Leaf key="g" className="size-3.5" />, <FileText key="h" className="size-3.5" />, <MessageCircle key="i" className="size-3.5" />];
const POS: Record<string, string> = { kahve: "center 60%", firsat: "center 40%", pasta: "center 45%", harman: "center 50%", panel: "center 55%" };

const chipIcon = (text: string, k: number) => {
  const t = text.toLowerCase();
  if (/kargo|teslim/.test(t)) return <Truck className="size-3.5" />;
  if (/saat|gün|hızlı/.test(t)) return <Clock className="size-3.5" />;
  if (/%|indirim|avantaj|fiyat/.test(t)) return <BadgePercent className="size-3.5" />;
  if (/koli|kg|paket|adet/.test(t)) return <Package className="size-3.5" />;
  if (/soğuk|dondur/.test(t)) return <Snowflake className="size-3.5" />;
  if (/whatsapp|mesaj/.test(t)) return <MessageCircle className="size-3.5" />;
  if (/pdf|fiş|belge/.test(t)) return <FileText className="size-3.5" />;
  if (/katkısız|organik|doğal/.test(t)) return <Leaf className="size-3.5" />;
  if (/kahve|orijin|kavur/.test(t)) return <Coffee className="size-3.5" />;
  return CHIP_ICONS[k % CHIP_ICONS.length];
};

const imageSrc = (image: string, variant: "" | "-m" | "-t") => (/^(https?:)?\/\//.test(image) || image.startsWith("/") ? image : `${BASE}/hero/${image}${variant}.webp`);

function toSlide(c: HeroSlideCfg): Slide {
  const a = ACCENT[c.accent] ?? ACCENT.gold;
  return {
    key: c.id,
    img: c.image,
    alt: c.tab,
    icon: ICONS[c.image] ?? <Sparkles className="size-4" />,
    tab: c.tab,
    tabSub: c.tabSub,
    kicker: c.kicker,
    title: (
      <>
        {splitHighlight(c.title).map((part, i) => (part.accent ? <em key={i} className={`not-italic ${a.text}`}>{part.text}</em> : <span key={i}>{part.text}</span>))}
      </>
    ),
    text: c.text,
    chips: c.chips.filter(Boolean).map((t, k) => ({ icon: chipIcon(t, k), text: t })),
    cta: { label: c.ctaLabel, href: c.ctaHref || "/" },
    alt2: c.altLabel ? { label: c.altLabel, href: c.altHref || "/" } : undefined,
    accent: a.text,
    ctaCls: a.cta,
    pos: POS[c.image],
  };
}

export function HeroSlider() {
  const cfg = useSiteConfig().hero;
  const slides = useMemo(() => cfg.filter((c) => c.enabled !== false).map(toSlide), [cfg]);
  const n = Math.max(1, slides.length);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || dragging) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, dragging, n, i]);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    setDragging(true);
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (startX.current !== null) {
      const dx = e.clientX - startX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    }
    startX.current = null;
    setDragging(false);
  };
  const running = !(paused || dragging);
  const s = slides[Math.min(i, slides.length - 1)];
  if (!s) return null;

  return (
    <section
      className="group relative h-[500px] select-none overflow-hidden rounded-2xl bg-coal-950 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] outline-none sm:h-[440px] lg:h-[500px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Kampanyalar"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        startX.current = null;
        setDragging(false);
      }}
      style={{ touchAction: "pan-y" }}
    >
      {/* Fotoğraflar */}
      {slides.map((sl, k) => (
        <div key={sl.key} className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
          <picture>
            <source media="(max-width: 639px)" srcSet={imageSrc(sl.img, "-m")} />
            <img
              key={k === i ? `kb-${i}` : sl.key}
              src={imageSrc(sl.img, "")}
              alt={sl.alt}
              className={`h-full w-full object-cover ${k === i && running ? "hero-kb" : ""}`}
              style={{ objectPosition: sl.pos }}
              loading={k === 0 ? "eager" : "lazy"}
              fetchPriority={k === 0 ? "high" : "auto"}
              draggable={false}
            />
          </picture>
          <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,5,4,0.88)_0%,rgba(6,5,4,0.62)_42%,rgba(6,5,4,0.18)_72%,rgba(6,5,4,0.05)_100%)]" />
          <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,5,4,0.85)_0%,rgba(6,5,4,0.35)_32%,transparent_60%)] sm:bg-[linear-gradient(0deg,rgba(6,5,4,0.7)_0%,rgba(6,5,4,0.15)_30%,transparent_55%)]" />
        </div>
      ))}

      {/* Metin */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 pt-6 sm:justify-center sm:px-12 sm:pb-24 sm:pt-0 lg:px-16 lg:pb-28">
        <div key={s.key} className="max-w-[640px]">
          <p className={`hero-in flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] ${s.accent}`} style={{ animationDelay: "60ms" }}>
            <span className="inline-block h-px w-7 bg-current" /> {s.kicker}
          </p>
          <h2 className="hero-in mt-2.5 text-[1.7rem] font-extrabold leading-[1.08] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:text-[2.6rem] lg:text-[3.1rem]" style={{ animationDelay: "160ms" }}>
            {s.title}
          </h2>
          <p className="hero-in mt-3 max-w-[520px] text-[0.85rem] leading-relaxed text-white/85 sm:mt-4 sm:text-base" style={{ animationDelay: "260ms" }}>
            {s.text}
          </p>
          <ul className="hero-in mt-4 flex flex-wrap gap-1.5" style={{ animationDelay: "340ms" }}>
            {s.chips.map((c, k) => (
              <li key={c.text} className={`${k === 2 ? "hidden sm:flex" : "flex"} items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[0.72rem] font-semibold text-white/90 backdrop-blur-sm`}>
                <span className={s.accent}>{c.icon}</span> {c.text}
              </li>
            ))}
          </ul>
          <div className="hero-in mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3" style={{ animationDelay: "420ms" }}>
            <Link href={s.cta.href} className={`inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-bold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition ${s.ctaCls}`}>
              {s.cta.label} <ArrowRight className="size-4" />
            </Link>
            {s.alt2 && (
              <Link href={s.alt2.href} className="inline-flex h-11 items-center gap-1 rounded-lg border border-white/25 px-4 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/10">
                {s.alt2.label} <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Oklar (sm+) */}
      <button onClick={() => go(i - 1)} aria-label="Önceki" className="absolute right-16 top-6 z-20 hidden size-10 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition hover:bg-white hover:text-ink-900 sm:grid">
        <ChevronLeft className="size-5" />
      </button>
      <button onClick={() => go(i + 1)} aria-label="Sonraki" className="absolute right-5 top-6 z-20 hidden size-10 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition hover:bg-white hover:text-ink-900 sm:grid">
        <ChevronRight className="size-5" />
      </button>

      {/* Sayaç */}
      <span className="absolute left-5 top-5 z-20 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[0.7rem] font-bold text-white/90 backdrop-blur sm:left-auto sm:right-28 sm:top-7 sm:border-0 sm:bg-transparent sm:px-0 sm:text-xs">
        <span className="text-white">{String(i + 1).padStart(2, "0")}</span>
        <span className="text-white/50"> / {String(n).padStart(2, "0")}</span>
      </span>

      {/* Masaüstü küçük resimler */}
      <div className="absolute inset-x-0 bottom-0 z-20 hidden px-6 pb-5 sm:block lg:px-8">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {slides.map((sl, k) => (
            <button key={sl.key} onClick={() => go(k)} aria-label={`Slayt ${k + 1}: ${sl.tab}`} className={`relative flex min-w-[170px] flex-1 items-center gap-2.5 overflow-hidden rounded-xl border px-2.5 py-2 text-left backdrop-blur transition ${k === i ? "border-white/40 bg-white/15" : "border-white/10 bg-black/25 hover:bg-white/10"}`}>
              <img src={imageSrc(sl.img, "-t")} alt="" className={`h-10 w-14 shrink-0 rounded-md object-cover transition ${k === i ? "" : "opacity-70"}`} draggable={false} />
              <span className="min-w-0">
                <span className={`block truncate text-[0.8rem] font-bold ${k === i ? "text-white" : "text-white/85"}`}>{sl.tab}</span>
                <span className="block truncate text-[0.68rem] text-white/60">{sl.tabSub}</span>
              </span>
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10" />
              {k === i && <span key={`t-${i}`} className="hero-progress absolute bottom-0 left-0 h-[3px] bg-gold-400" style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: running ? "running" : "paused" }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Mobil göstergeler */}
      <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-between px-5 sm:hidden">
        <div className="flex items-center gap-1.5">
          {slides.map((sl, k) => (
            <button key={sl.key} onClick={() => go(k)} aria-label={`Slayt ${k + 1}: ${sl.tab}`} className={`relative h-1.5 overflow-hidden rounded-full bg-white/35 transition-all ${k === i ? "w-9" : "w-1.5"}`}>
              {k === i && <span key={`p-${i}`} className="hero-progress absolute inset-y-0 left-0 bg-white" style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: running ? "running" : "paused" }} />}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => go(i - 1)} aria-label="Önceki" className="grid size-9 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={() => go(i + 1)} aria-label="Sonraki" className="grid size-9 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
