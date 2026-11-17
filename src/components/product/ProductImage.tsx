import Image from "next/image";
import type { PackArt as ArtType } from "@/lib/types";
import { PackArt } from "./PackArt";

/** Fotoğraf varsa fotoğraf, yoksa üretilen ambalaj görseli. */
export function ProductImage({ name, brand, art, hue, image, label, className = "", sizes = "(min-width: 1024px) 20vw, 50vw", priority }: { name: string; brand: string; art: ArtType; hue: number; image?: string; label?: string; className?: string; sizes?: string; priority?: boolean }) {
  if (image) return <Image src={image} alt={name} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#fff,#f1f3f6)] ${className}`}>
      <PackArt art={art} hue={hue} name={name} brand={brand} label={label} className="h-[88%] w-auto drop-shadow-[0_12px_18px_rgba(14,27,42,0.18)]" />
    </div>
  );
}
