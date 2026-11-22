"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/config/ConfigProvider";
import { Truck, Boxes, BadgePercent, Building2, Store, Coffee } from "lucide-react";
import type { TileIcon, TileStyle } from "@/lib/content";

const ICONS: Record<TileIcon, typeof Truck> = { truck: Truck, percent: BadgePercent, boxes: Boxes, building: Building2, store: Store, coffee: Coffee };
export const TILE_STYLES: Record<TileStyle, string> = { green: "banner-d text-white", orange: "banner-b text-white", blue: "banner-a text-white", white: "bg-white border border-ink-200 text-ink-900", coal: "bg-coal-900 text-white" };

export function CampaignTiles() {
  const tiles = useSiteConfig().tiles;
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t) => {
        const I = ICONS[t.icon] ?? Truck;
        return (
          <Link key={t.id} href={t.href || "/"} className={`flex items-center gap-3 rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-hover ${TILE_STYLES[t.style] ?? TILE_STYLES.white}`}>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/20">
              <I className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight">{t.title}</span>
              <span className="block text-xs opacity-80">{t.text}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
