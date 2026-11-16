import Image from "next/image";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { categoryMap } from "@/lib/categories";

/**
 * Ürün görseli. Fotoğraf varsa onu, yoksa kategori ikonlu ve ürün tonunda
 * bir yer tutucu gösterir. Gerçek fotoğraflar eklendikçe otomatik değişir.
 */
export function ProductVisual({
  name,
  category,
  hue,
  image,
  label,
  className = "",
  sizes = "(min-width: 1024px) 20vw, 50vw",
  priority,
}: {
  name: string;
  category: string;
  hue: number;
  image?: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (image) {
    return <Image src={image} alt={name} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  const cat = categoryMap[category];
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(145deg, hsl(${hue} 60% 94%), hsl(${hue} 45% 86%))` }}
    >
      <span className="absolute -right-6 -top-6 size-28 rounded-full" style={{ background: `hsl(${hue} 55% 80% / 0.6)` }} />
      <span className="absolute -bottom-10 -left-8 size-32 rounded-full" style={{ background: `hsl(${hue} 50% 78% / 0.5)` }} />
      <span className="relative grid size-[38%] place-items-center rounded-2xl bg-white/70 shadow-[0_10px_30px_-14px_rgb(0_0_0/0.35)] backdrop-blur-sm">
        <CategoryIcon name={cat?.icon ?? "package"} className="size-[55%]" style={{ color: `hsl(${hue} 55% 38%)` }} strokeWidth={1.6} />
      </span>
      {label && (
        <span className="absolute bottom-3 left-3 rounded-md bg-white/80 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: `hsl(${hue} 50% 30%)` }}>
          {label}
        </span>
      )}
    </div>
  );
}
