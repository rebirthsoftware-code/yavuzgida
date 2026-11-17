import type { PackArt as ArtType } from "@/lib/types";

/**
 * Üretilen ürün görseli ("packshot"). Fotoğraf gelene kadar her ürün için
 * ambalaj tipine, ürün tonuna, markaya ve ada göre SVG ambalaj çizer.
 * Fotoğraf eklendiğinde ProductImage bu bileşen yerine fotoğrafı gösterir.
 */
type Props = {
  art: ArtType;
  hue: number;
  name: string;
  brand: string;
  label?: string;
  className?: string;
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
  const c1 = `hsl(${hue} 62% 48%)`;
  const c2 = `hsl(${hue} 58% 36%)`;
  const soft = `hsl(${hue} 50% 92%)`;
  const dark = `hsl(${hue} 40% 22%)`;
  const lines = wrap(name, 13);
  const id = `g${Math.abs(hashCode(name + brand))}`;

  const label_ = ({ x, y, w, h, light = false }: { x: number; y: number; w: number; h: number; light?: boolean }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={light ? "rgba(255,255,255,0.92)" : "#fff"} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize="6.5" fontWeight="700" letterSpacing="1.2" fill={c2} fontFamily="Inter, system-ui, sans-serif">
        {brand.toUpperCase()}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + w / 2} y={y + 28 + i * 12} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={dark} fontFamily="Inter, system-ui, sans-serif">
          {l}
        </text>
      ))}
      {label && (
        <text x={x + w / 2} y={y + h - 7} textAnchor="middle" fontSize="7" fontWeight="600" fill={c1} fontFamily="Inter, system-ui, sans-serif">
          {label}
        </text>
      )}
    </g>
  );

  return (
    <svg viewBox="0 0 160 200" className={className} role="img" aria-label={`${brand} ${name}`}>
      <defs>
        <linearGradient id={`${id}a`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={c2} />
          <stop offset="0.45" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <radialGradient id={`${id}s`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(0,0,0,0.28)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      {/* zemin gölgesi */}
      <ellipse cx="80" cy="186" rx="52" ry="8" fill={`url(#${id}s)`} />

      {art === "sack" && (
        <g>
          <path d="M34 60 Q30 40 48 38 L112 38 Q130 40 126 60 L130 170 Q130 184 116 184 L44 184 Q30 184 30 170 Z" fill={`url(#${id}a)`} />
          <path d="M34 60 Q30 40 48 38 L112 38 Q130 40 126 60 L124 90 L36 90 Z" fill={`url(#${id}b)`} />
          <path d="M48 38 Q80 30 112 38 L108 24 Q80 18 52 24 Z" fill={c2} />
          <path d="M52 24 Q80 14 108 24" stroke={soft} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M40 100 L120 100 M40 120 L120 120 M40 140 L120 140" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          {label_({ x: 42, y: 96, w: 76, h: 60 })}
        </g>
      )}

      {art === "pouch" && (
        <g>
          <path d="M40 42 L120 42 L128 176 Q128 186 118 186 L42 186 Q32 186 32 176 Z" fill={`url(#${id}a)`} />
          <path d="M40 42 L120 42 L124 100 L36 100 Z" fill={`url(#${id}b)`} />
          <rect x="40" y="30" width="80" height="14" rx="3" fill={c2} />
          <path d="M46 37 L114 37" stroke={soft} strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="52" y="128" width="56" height="40" rx="6" fill={soft} opacity="0.85" />
          <circle cx="66" cy="150" r="5" fill={c1} opacity="0.5" />
          <circle cx="80" cy="146" r="6" fill={c1} opacity="0.6" />
          <circle cx="94" cy="151" r="5" fill={c1} opacity="0.5" />
          {label_({ x: 42, y: 60, w: 76, h: 58 })}
        </g>
      )}

      {art === "bottle" && (
        <g>
          <rect x="66" y="14" width="28" height="18" rx="4" fill={dark} />
          <path d="M68 32 L92 32 L96 44 Q110 56 110 74 L110 176 Q110 186 100 186 L60 186 Q50 186 50 176 L50 74 Q50 56 64 44 Z" fill={`url(#${id}a)`} />
          <path d="M60 60 Q52 80 54 170" stroke="rgba(255,255,255,0.45)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x="68" y="32" width="24" height="6" fill={c2} />
          {label_({ x: 54, y: 92, w: 52, h: 62 })}
        </g>
      )}

      {art === "jar" && (
        <g>
          <rect x="44" y="26" width="72" height="22" rx="6" fill={dark} />
          <rect x="44" y="40" width="72" height="8" fill={c2} />
          <path d="M42 50 L118 50 Q124 50 124 58 L124 174 Q124 186 112 186 L48 186 Q36 186 36 174 L36 58 Q36 50 42 50 Z" fill={`url(#${id}a)`} />
          <path d="M42 50 L118 50 Q124 50 124 58 L124 96 L36 96 L36 58 Q36 50 42 50 Z" fill={`url(#${id}b)`} />
          <path d="M46 64 Q44 110 46 170" stroke="rgba(255,255,255,0.5)" strokeWidth="5" fill="none" strokeLinecap="round" />
          {label_({ x: 46, y: 88, w: 68, h: 64, light: true })}
        </g>
      )}

      {art === "can" && (
        <g>
          <rect x="40" y="36" width="80" height="148" rx="8" fill={`url(#${id}a)`} />
          <ellipse cx="80" cy="36" rx="40" ry="10" fill={dark} />
          <ellipse cx="80" cy="36" rx="32" ry="7" fill={c2} />
          <ellipse cx="80" cy="184" rx="40" ry="8" fill={c2} />
          <path d="M48 50 Q46 110 48 172" stroke="rgba(255,255,255,0.45)" strokeWidth="4" fill="none" strokeLinecap="round" />
          {label_({ x: 48, y: 78, w: 64, h: 62 })}
        </g>
      )}

      {art === "box" && (
        <g>
          <path d="M36 50 L124 50 L124 182 L36 182 Z" fill={`url(#${id}a)`} />
          <path d="M36 50 L50 34 L138 34 L124 50 Z" fill={soft} />
          <path d="M124 50 L138 34 L138 166 L124 182 Z" fill={c2} />
          <path d="M36 50 L124 50 L124 90 L36 90 Z" fill={`url(#${id}b)`} />
          <rect x="44" y="150" width="72" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
          {label_({ x: 44, y: 78, w: 72, h: 62 })}
        </g>
      )}

      {art === "carton" && (
        <g>
          <path d="M40 60 L120 60 L120 182 L40 182 Z" fill={`url(#${id}a)`} />
          <path d="M40 60 L80 30 L120 60 Z" fill={soft} />
          <path d="M40 60 L80 30 L80 44 L46 72 Z" fill={c2} opacity="0.5" />
          <rect x="72" y="22" width="16" height="10" rx="3" fill={dark} />
          <circle cx="80" cy="150" r="16" fill="rgba(255,255,255,0.22)" />
          {label_({ x: 48, y: 82, w: 64, h: 60 })}
        </g>
      )}
    </svg>
  );
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
