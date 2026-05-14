"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchStores } from "@/lib/stores";
import { StoreCard } from "@/components/store-card";
import { Button } from "@/components/ui/button";
import type { Store } from "@/lib/types";

const DEFAULT_COORDS = { lat: 22.3565, lng: 91.8199 };

export default function StoresPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(50);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords(DEFAULT_COORDS),
        { timeout: 5000 }
      );
    } else {
      setCoords(DEFAULT_COORDS);
    }
  }, []);

  const { data: stores, isLoading, isError } = useQuery({
    queryKey: ["stores", "search", coords?.lat, coords?.lng, radius],
    queryFn: () => searchStores(coords!.lat, coords!.lng, radius),
    enabled: !!coords,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">দোকানসমূহ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            আপনার কাছের স্ট্রিট ফুডের দোকান
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">রেডিয়াস:</span>
          {[5, 10, 20, 50].map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                radius === r
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {r} কিমি
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="mt-16 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      {isError && (
        <p className="mt-8 text-center text-sm text-destructive">দোকান লোড করতে সমস্যা হয়েছে</p>
      )}

      {stores && stores.length > 0 && (
        <>
          <p className="mt-6 text-xs text-muted-foreground">{stores.length}টি দোকান পাওয়া গেছে</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stores.map((store: Store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </>
      )}

      {stores && stores.length === 0 && (
        <div className="mt-16 flex flex-col items-center py-10 text-center">
          <span className="text-5xl">🍃</span>
          <h2 className="mt-4 text-lg font-semibold">কোনো দোকান পাওয়া যায়নি</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            এই এলাকায় কোনো দোকান নেই। রেডিয়াস বাড়িয়ে আবার চেষ্টা করুন।
          </p>
        </div>
      )}
    </div>
  );
}
