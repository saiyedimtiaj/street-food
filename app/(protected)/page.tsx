"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { searchStores } from "@/lib/stores";
import { StoreCard } from "@/components/store-card";
import { Button } from "@/components/ui/button";
import type { Store } from "@/lib/types";

const DEFAULT_COORDS = { lat: 22.3565, lng: 91.8199 };

export default function HomePage() {
  const { user } = useAuth();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoAttempted, setGeoAttempted] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGeoAttempted(true);
        },
        () => {
          setCoords(DEFAULT_COORDS);
          setGeoAttempted(true);
        },
        { timeout: 5000 }
      );
    } else {
      setCoords(DEFAULT_COORDS);
      setGeoAttempted(true);
    }
  }, []);

  const { data: stores, isLoading } = useQuery({
    queryKey: ["home-stores", coords?.lat, coords?.lng],
    queryFn: () => searchStores(coords!.lat, coords!.lng, 50),
    enabled: !!coords,
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section className="py-6 sm:py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          স্বাগতম, {user.name} 👋
        </h1>
        <p className="mt-2 max-w-lg text-base text-muted-foreground">
          {user.role === "admin"
            ? "প্ল্যাটফর্ম ব্যবস্থাপনা করুন"
            : user.role === "store"
            ? "আপনার দোকান পরিচালনা করুন"
            : "আপনার কাছের সেরা স্ট্রিট ফুড খুঁজে দেখুন"}
        </p>
      </section>

      {/* Quick links */}
      <QuickLinks role={user.role} />

      {/* Nearby stores */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">কাছের দোকানসমূহ</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              ৫০ কিলোমিটারের মধ্যে
            </p>
          </div>
          <Link href="/stores">
            <Button variant="outline" size="sm">সব দেখুন →</Button>
          </Link>
        </div>

        {(!geoAttempted || isLoading) && (
          <div className="mt-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {stores && stores.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stores.slice(0, 12).map((store: Store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}

        {stores && stores.length === 0 && (
          <div className="mt-12 flex flex-col items-center py-10 text-center">
            <span className="text-5xl">🍃</span>
            <h3 className="mt-4 text-base font-semibold">কোনো দোকান পাওয়া যায়নি</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              এই এলাকায় কোনো দোকান নেই। অন্য জায়গায় খুঁজুন।
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function QuickLinks({ role }: { role: string }) {
  const links =
    role === "admin"
      ? [
          { href: "/admin", icon: "📊", title: "ড্যাশবোর্ড" },
          { href: "/admin/users", icon: "👥", title: "ব্যবহারকারী" },
          { href: "/admin/stores", icon: "🏪", title: "দোকান ব্যবস্থাপনা" },
          { href: "/admin/suggestions", icon: "💡", title: "সাজেশন" },
          { href: "/admin/claims", icon: "📋", title: "দাবি" },
        ]
      : role === "store"
      ? [
          { href: "/my-store", icon: "🏪", title: "আমার দোকান" },
          { href: "/my-store/menu", icon: "🍽️", title: "মেনু" },
          { href: "/my-store/gallery", icon: "📸", title: "গ্যালারি" },
          { href: "/my-store/reviews", icon: "⭐", title: "রিভিউ" },
          { href: "/claim", icon: "📋", title: "দাবি করুন" },
        ]
      : [
          { href: "/search", icon: "🔍", title: "খুঁজুন" },
          { href: "/my-reviews", icon: "✍️", title: "আমার রিভিউ" },
          { href: "/suggest", icon: "💡", title: "সাজেস্ট" },
          { href: "/popular", icon: "🔥", title: "জনপ্রিয়" },
          { href: "/reviews", icon: "⭐", title: "সব রিভিউ" },
        ];

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="flex items-center gap-2 rounded-full border border-border/40 px-4 py-2 text-sm transition-colors hover:border-primary/30 hover:text-primary"
        >
          <span>{l.icon}</span>
          <span className="font-medium">{l.title}</span>
        </Link>
      ))}
    </div>
  );
}
