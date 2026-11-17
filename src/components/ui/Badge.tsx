import type { ProductTag } from "@/lib/types";

const tagStyle: Record<ProductTag, { label: string; cls: string }> = {
  "cok-satan": { label: "Çok Satan", cls: "bg-orange-500 text-white" },
  yeni: { label: "Yeni", cls: "bg-sky-600 text-white" },
  indirim: { label: "İndirim", cls: "bg-red-600 text-white" },
  yerli: { label: "Yerli Üretim", cls: "bg-green-100 text-green-600" },
  organik: { label: "Organik", cls: "bg-green-100 text-green-600" },
  glutensiz: { label: "Glutensiz", cls: "bg-sky-100 text-sky-700" },
  vegan: { label: "Vegan", cls: "bg-green-100 text-green-600" },
};

export function TagBadge({ tag, className = "" }: { tag: ProductTag; className?: string }) {
  const t = tagStyle[tag];
  return <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[0.65rem] font-bold ${t.cls} ${className}`}>{t.label}</span>;
}

export const tagLabel = (tag: ProductTag) => tagStyle[tag].label;
