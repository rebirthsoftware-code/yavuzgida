import Link from "next/link";
import { categories } from "@/lib/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export function CategoryCircles() {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-2 sm:overflow-visible sm:px-0 lg:grid-cols-12">
      {categories.map((c) => (
        <Link key={c.slug} href={`/kategori/${c.slug}`} className="group flex w-[76px] shrink-0 flex-col items-center text-center sm:w-auto">
          <span className="grid size-16 place-items-center rounded-full ring-2 ring-transparent transition group-hover:ring-orange-400 sm:size-[4.5rem]" style={{ background: c.colorSoft, color: c.color }}>
            <CategoryIcon name={c.icon} className="size-7" strokeWidth={1.8} />
          </span>
          <span className="mt-2 text-[0.72rem] font-semibold leading-tight text-ink-800 group-hover:text-orange-600">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}
