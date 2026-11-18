import type { CSSProperties } from "react";
import type { PackArt as ArtType } from "@/lib/types";

/**
 * Üretilen ürün görseli ("packshot"). Şekil PackSprite'tan <use> ile gelir (hafif),
 * etiket (marka, ad, gramaj) örnek başına yazılır. Fotoğraf eklenince ProductImage
 * bu bileşen yerine fotoğrafı gösterir.
 */
type Props = { art: ArtType; hue: number; name: string; brand: string; label?: string; className?: string };

/* Etiket alanı (x, y, w, h, açık zemin) — şekil başına */
const LABEL: Record<ArtType, [number, number, number, number, boolean?]> = {
  sack: [42, 96, 76, 60],
  pouch: [42, 60, 76, 58],
  bottle: [54, 92, 52, 62],
  jar: [46, 88, 68, 64, true],
  can: [48, 78, 64, 62],
  box: [44, 78, 72, 62],
  carton: [48, 82, 64, 60],
};

const wrap = (s: string, max: number): string[] => {
  const words = s.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
};

export function PackArt({ art, hue, name, brand, label, className = "" }: Props) {
  const [x, y, w, h, light] = LABEL[art] ?? LABEL.box;
  const lines = wrap(name, 13);
  const vars = { "--c1": `hsl(${hue} 62% 48%)`, "--c2": `hsl(${hue} 58% 36%)`, "--soft": `hsl(${hue} 50% 92%)`, "--dark": `hsl(${hue} 40% 22%)` } as CSSProperties;
  return (
    <svg viewBox="0 0 160 200" className={className} style={vars} role="img" aria-label={`${brand} ${name}`}>
      <use href={`#pk-${art}`} />
      <rect x={x} y={y} width={w} height={h} rx={4} fill={light ? "rgba(255,255,255,0.92)" : "#fff"} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize="6.5" fontWeight="700" letterSpacing="1.2" style={{ fill: "var(--c2)" }}>
        {brand.toUpperCase()}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + w / 2} y={y + 28 + i * 12} textAnchor="middle" fontSize="10.5" fontWeight="800" style={{ fill: "var(--dark)" }}>
          {l}
        </text>
      ))}
      {label && (
        <text x={x + w / 2} y={y + h - 7} textAnchor="middle" fontSize="7" fontWeight="600" style={{ fill: "var(--c1)" }}>
          {label}
        </text>
      )}
    </svg>
  );
}
