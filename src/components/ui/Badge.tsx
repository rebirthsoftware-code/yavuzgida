import type { ProductTag } from "@/lib/types";

const tagStyle: Record<ProductTag, { label: string; cls: string }> = {
  "cok-satan": { label: "Çok satan", cls: "bg-tangerine-500 text-white" },
  yeni: { label: "Yeni", cls: "bg-green-700 text-white" },
  indirim: { label: "İndirim", cls: "bg-red-600 text-white" },
  yerli: { label: "Yerli üretim", cls: "bg-wheat-200 text-ink-800" },
  organik: { label: "Organik", cls: "bg-green-100 text-green-900" },
  glutensiz: { label: "Glutensiz", cls: "bg-paper-100 text-ink-700" },
  vegan: { label: "Vegan", cls: "bg-green-100 text-green-900" },
};

export function TagBadge({ tag, className = "" }: { tag: ProductTag; className?: string }) {
  const t = tagStyle[tag];
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide ${t.cls} ${className}`}>{t.label}</span>;
}

export const tagLabel = (tag: ProductTag) => tagStyle[tag].label;
