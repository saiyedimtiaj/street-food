"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { searchStores } from "@/lib/stores";
import { createClaim } from "@/lib/claims";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/animations";
import type { Store } from "@/lib/types";

export default function ClaimPage() {
  const router = useRouter();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  const { data: stores } = useQuery({
    queryKey: ["stores-for-claim", coords?.lat, coords?.lng],
    queryFn: () => searchStores(coords!.lat, coords!.lng, 50),
    enabled: !!coords,
  });

  const unclaimedStores = stores?.filter((s: Store) => !s.is_claimed && !s.owner_id);

  const claimMutation = useMutation({
    mutationFn: createClaim,
    onSuccess: () => router.push("/my-store"),
    onError: (err: any) => {
      setError(err.response?.data?.message || "দাবি জমা দিতে সমস্যা হয়েছে");
    },
  });

  function handleGetLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  function handleClaim() {
    if (!selectedStore) return;
    setError("");
    claimMutation.mutate({
      store_id: selectedStore.id,
      message: message || undefined,
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight font-heading">দোকান দাবি করুন 📋</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        আপনার দোকান যদি প্ল্যাটফর্মে থাকে কিন্তু মালিকবিহীন, তাহলে দাবি করুন
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!coords && (
        <div className="mt-8 text-center">
          <Button onClick={handleGetLocation} disabled={locating}>
            {locating ? "খুঁজছি..." : "📍 লোকেশন দিয়ে দোকান খুঁজুন"}
          </Button>
        </div>
      )}

      {unclaimedStores && unclaimedStores.length === 0 && (
        <div className="mt-12 text-center">
          <span className="text-4xl">🍃</span>
          <p className="mt-3 text-sm text-muted-foreground">কোনো মালিকবিহীন দোকান পাওয়া যায়নি</p>
        </div>
      )}

      {unclaimedStores && unclaimedStores.length > 0 && !selectedStore && (
        <div className="mt-6 space-y-2">
          <p className="text-sm text-muted-foreground">{unclaimedStores.length}টি মালিকবিহীন দোকান:</p>
          {unclaimedStores.map((store: Store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className="flex w-full items-center gap-4 rounded-xl border border-primary/10 p-4 text-left transition-all hover:border-primary/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-lg">🏪</span>
              <div>
                <p className="font-semibold">{store.name}</p>
                <p className="text-xs text-muted-foreground">{store.address || "ঠিকানা নেই"}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedStore && (
        <div className="mt-6 rounded-xl border border-primary/10 p-5">
          <h3 className="font-semibold">দাবি করছেন: {selectedStore.name}</h3>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium">মেসেজ (ঐচ্ছিক)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="কেন আপনি এই দোকানের মালিক তা ব্যাখ্যা করুন..."
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleClaim} disabled={claimMutation.isPending}>
              {claimMutation.isPending ? "জমা হচ্ছে..." : "দাবি জমা দিন"}
            </Button>
            <Button variant="outline" onClick={() => setSelectedStore(null)}>
              বাতিল
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

