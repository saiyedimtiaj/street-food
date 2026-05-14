"use client";

import Link from "next/link";
import type { Store } from "@/lib/types";
import { getStoreImage } from "@/lib/images";

export function StoreCard({ store }: { store: Store }) {
  const imgSrc = getStoreImage(store.cover_image, store.category);

  return (
    <Link href={`/stores/${store.id}`} className="group block overflow-hidden rounded-xl border border-border/40 transition-colors hover:border-primary/30">
      <div className="relative aspect-16/10 overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt={store.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {store.distance_km !== undefined && (
          <span className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            {store.distance_km < 1
              ? `${Math.round(store.distance_km * 1000)} মি`
              : `${store.distance_km.toFixed(1)} কিমি`}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {store.name}
          </h3>
          {store.averageRating !== undefined && store.averageRating > 0 && (
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-primary/5 px-2 py-0.5 text-xs font-semibold">
              <span className="text-yellow-500">★</span>
              {store.averageRating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {store.category && (
            <span className="rounded-full border border-border/40 px-2 py-0.5 text-[11px] text-muted-foreground">
              {store.category}
            </span>
          )}
          {store.totalReviews !== undefined && store.totalReviews > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {store.totalReviews} রিভিউ
            </span>
          )}
        </div>
        {store.address && (
          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
            📍 {store.address}
          </p>
        )}
      </div>
    </Link>
  );
}
