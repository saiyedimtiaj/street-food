"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, MessageSquare } from "lucide-react";
import type { Store } from "@/lib/types";
import { getStoreImage } from "@/lib/images";

export function StoreCard({ store }: { store: Store }) {
  const imgSrc = getStoreImage(store.cover_image, store.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href={`/stores/${store.id}`}
        className="group block rounded-2xl border border-border/60 overflow-hidden transition-all duration-300 hover:border-primary/40 bg-card"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={imgSrc}
            alt={store.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {store.averageRating !== undefined && store.averageRating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-semibold text-white">{store.averageRating.toFixed(1)}</span>
            </div>
          )}

          {store.distance_km !== undefined && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md">
              <MapPin size={10} className="text-white/70" />
              <span className="text-[11px] font-medium text-white">
                {store.distance_km < 1
                  ? `${Math.round(store.distance_km * 1000)} মি`
                  : `${store.distance_km.toFixed(1)} কিমি`}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-[15px] font-semibold leading-snug line-clamp-1 transition-colors group-hover:text-primary font-heading">
            {store.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {store.category && (
              <span className="rounded-full bg-primary/8 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                {store.category}
              </span>
            )}
            {store.totalReviews !== undefined && store.totalReviews > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MessageSquare size={10} />
                {store.totalReviews} রিভিউ
              </span>
            )}
          </div>
          {store.address && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground line-clamp-1">
              <MapPin size={11} className="shrink-0 text-muted-foreground/60" />
              {store.address}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
