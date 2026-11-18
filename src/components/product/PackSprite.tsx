/**
 * Ambalaj şekilleri sprite'ı: sayfada bir kez basılır, PackArt <use> ile çağırır.
 * Renkler CSS değişkenleriyle (--c1, --c2, --soft, --dark) örnek başına verilir.
 */
export function PackSprite() {
  const f1 = { fill: "var(--c1)" };
  const f2 = { fill: "var(--c2)" };
  const fs = { fill: "var(--soft)" };
  const fd = { fill: "var(--dark)" };
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="pk-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(0,0,0,0.28)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="pk-shine" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.38)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="pk-side" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="0.5" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.22)" />
        </linearGradient>

        <symbol id="pk-star" viewBox="0 0 12 12" width="12" height="12">
          <path d="M6 .8l1.6 3.3 3.6.5-2.6 2.5.6 3.6L6 9l-3.2 1.7.6-3.6L.8 4.6l3.6-.5z" />
        </symbol>

        <symbol id="pk-sack" viewBox="0 0 160 200">
          <ellipse cx="80" cy="186" rx="52" ry="8" fill="url(#pk-shadow)" />
          <path d="M34 60 Q30 40 48 38 L112 38 Q130 40 126 60 L130 170 Q130 184 116 184 L44 184 Q30 184 30 170 Z" style={f1} />
          <path d="M34 60 Q30 40 48 38 L112 38 Q130 40 126 60 L130 170 Q130 184 116 184 L44 184 Q30 184 30 170 Z" fill="url(#pk-side)" />
          <path d="M34 60 Q30 40 48 38 L112 38 Q130 40 126 60 L124 90 L36 90 Z" fill="url(#pk-shine)" />
          <path d="M48 38 Q80 30 112 38 L108 24 Q80 18 52 24 Z" style={f2} />
          <path d="M52 24 Q80 14 108 24" style={{ stroke: "var(--soft)" }} strokeWidth="3" fill="none" strokeLinecap="round" />
        </symbol>

        <symbol id="pk-pouch" viewBox="0 0 160 200">
          <ellipse cx="80" cy="188" rx="50" ry="7" fill="url(#pk-shadow)" />
          <path d="M40 42 L120 42 L128 176 Q128 186 118 186 L42 186 Q32 186 32 176 Z" style={f1} />
          <path d="M40 42 L120 42 L128 176 Q128 186 118 186 L42 186 Q32 186 32 176 Z" fill="url(#pk-side)" />
          <path d="M40 42 L120 42 L124 100 L36 100 Z" fill="url(#pk-shine)" />
          <rect x="40" y="30" width="80" height="14" rx="3" style={f2} />
          <path d="M46 37 L114 37" style={{ stroke: "var(--soft)" }} strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="52" y="128" width="56" height="40" rx="6" style={fs} opacity="0.85" />
          <circle cx="66" cy="150" r="5" style={f1} opacity="0.5" />
          <circle cx="80" cy="146" r="6" style={f1} opacity="0.6" />
          <circle cx="94" cy="151" r="5" style={f1} opacity="0.5" />
        </symbol>

        <symbol id="pk-bottle" viewBox="0 0 160 200">
          <ellipse cx="80" cy="188" rx="36" ry="7" fill="url(#pk-shadow)" />
          <rect x="66" y="14" width="28" height="18" rx="4" style={fd} />
          <path d="M68 32 L92 32 L96 44 Q110 56 110 74 L110 176 Q110 186 100 186 L60 186 Q50 186 50 176 L50 74 Q50 56 64 44 Z" style={f1} />
          <path d="M68 32 L92 32 L96 44 Q110 56 110 74 L110 176 Q110 186 100 186 L60 186 Q50 186 50 176 L50 74 Q50 56 64 44 Z" fill="url(#pk-side)" />
          <path d="M60 60 Q52 80 54 170" stroke="rgba(255,255,255,0.45)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x="68" y="32" width="24" height="6" style={f2} />
        </symbol>

        <symbol id="pk-jar" viewBox="0 0 160 200">
          <ellipse cx="80" cy="188" rx="48" ry="7" fill="url(#pk-shadow)" />
          <rect x="44" y="26" width="72" height="22" rx="6" style={fd} />
          <rect x="44" y="40" width="72" height="8" style={f2} />
          <path d="M42 50 L118 50 Q124 50 124 58 L124 174 Q124 186 112 186 L48 186 Q36 186 36 174 L36 58 Q36 50 42 50 Z" style={f1} />
          <path d="M42 50 L118 50 Q124 50 124 58 L124 174 Q124 186 112 186 L48 186 Q36 186 36 174 L36 58 Q36 50 42 50 Z" fill="url(#pk-side)" />
          <path d="M42 50 L118 50 Q124 50 124 58 L124 96 L36 96 L36 58 Q36 50 42 50 Z" fill="url(#pk-shine)" />
          <path d="M46 64 Q44 110 46 170" stroke="rgba(255,255,255,0.5)" strokeWidth="5" fill="none" strokeLinecap="round" />
        </symbol>

        <symbol id="pk-can" viewBox="0 0 160 200">
          <ellipse cx="80" cy="190" rx="46" ry="7" fill="url(#pk-shadow)" />
          <rect x="40" y="36" width="80" height="148" rx="8" style={f1} />
          <rect x="40" y="36" width="80" height="148" rx="8" fill="url(#pk-side)" />
          <ellipse cx="80" cy="36" rx="40" ry="10" style={fd} />
          <ellipse cx="80" cy="36" rx="32" ry="7" style={f2} />
          <ellipse cx="80" cy="184" rx="40" ry="8" style={f2} />
          <path d="M48 50 Q46 110 48 172" stroke="rgba(255,255,255,0.45)" strokeWidth="4" fill="none" strokeLinecap="round" />
        </symbol>

        <symbol id="pk-box" viewBox="0 0 160 200">
          <ellipse cx="84" cy="188" rx="54" ry="7" fill="url(#pk-shadow)" />
          <path d="M36 50 L124 50 L124 182 L36 182 Z" style={f1} />
          <path d="M36 50 L50 34 L138 34 L124 50 Z" style={fs} />
          <path d="M124 50 L138 34 L138 166 L124 182 Z" style={f2} />
          <path d="M36 50 L124 50 L124 90 L36 90 Z" fill="url(#pk-shine)" />
          <rect x="44" y="150" width="72" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
        </symbol>

        <symbol id="pk-carton" viewBox="0 0 160 200">
          <ellipse cx="80" cy="188" rx="46" ry="7" fill="url(#pk-shadow)" />
          <path d="M40 60 L120 60 L120 182 L40 182 Z" style={f1} />
          <path d="M40 60 L120 60 L120 182 L40 182 Z" fill="url(#pk-side)" />
          <path d="M40 60 L80 30 L120 60 Z" style={fs} />
          <path d="M40 60 L80 30 L80 44 L46 72 Z" style={f2} opacity="0.5" />
          <rect x="72" y="22" width="16" height="10" rx="3" style={fd} />
          <circle cx="80" cy="150" r="16" fill="rgba(255,255,255,0.22)" />
        </symbol>
      </defs>
    </svg>
  );
}
