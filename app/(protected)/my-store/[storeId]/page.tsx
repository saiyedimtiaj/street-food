"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MessageSquare, UtensilsCrossed, Image as ImageIcon, Pencil, MapPin, ChevronRight, Navigation } from "lucide-react";
import { getStoreById, updateStore } from "@/lib/stores";

const StaticMap = dynamic(() => import("@/components/static-map").then((m) => ({ default: m.StaticMap })), {
  ssr: false,
  loading: () => <div className="h-48 sm:h-56 rounded-xl border border-border/60 animate-pulse bg-muted/20" />,
});
import { getReviewsByStore } from "@/lib/reviews";
import { getFoodsByStore } from "@/lib/foods";
import { getStoreImage } from "@/lib/images";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";

export default function StoreOverviewPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["store-reviews", storeId, 1],
    queryFn: () => getReviewsByStore(storeId, 1, 3),
    enabled: !!store,
  });

  const { data: foods } = useQuery({
    queryKey: ["foods", storeId],
    queryFn: () => getFoodsByStore(storeId),
    enabled: !!store,
  });

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAddress, setEditAddress] = useState("");

  function startEditing() {
    if (!store) return;
    setEditName(store.name);
    setEditDesc(store.description || "");
    setEditCategory(store.category || "");
    setEditAddress(store.address || "");
    setEditing(true);
  }

  const updateMut = useMutation({
    mutationFn: (formData: FormData) => updateStore(storeId, formData),
    onSuccess: () => {
      toast("দোকানের তথ্য আপডেট হয়েছে", "success");
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["store", storeId] });
    },
    onError: () => toast("আপডেট করতে সমস্যা হয়েছে", "error"),
  });

  function handleSave() {
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDesc);
    formData.append("category", editCategory);
    formData.append("address", editAddress);
    updateMut.mutate(formData);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 sm:h-64 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (!store) return null;
  const reviews = reviewsData?.reviews || [];

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      {/* Hero */}
      <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden">
        <img src={getStoreImage(store.cover_image, store.category)} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <h2 className="text-2xl font-bold font-heading text-white">{store.name}</h2>
          <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            store.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
          }`}>
            {store.status === "active" ? "সক্রিয়" : store.status === "suspended" ? "স্থগিত" : "নিষ্ক্রিয়"}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={staggerItem} className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            Rating
          </div>
          <p className="text-3xl font-bold">{store.averageRating?.toFixed(1) || "—"}</p>
        </motion.div>
        <motion.div variants={staggerItem} className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MessageSquare size={16} />
            রিভিউ
          </div>
          <p className="text-3xl font-bold">{store.totalReviews || 0}</p>
        </motion.div>
        <motion.div variants={staggerItem} className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <UtensilsCrossed size={16} />
            মেনু আইটেম
          </div>
          <p className="text-3xl font-bold">{foods?.length || 0}</p>
        </motion.div>
        <motion.div variants={staggerItem} className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <ImageIcon size={16} />
            গ্যালারি
          </div>
          <p className="text-3xl font-bold">{store.gallery?.length || 0}</p>
        </motion.div>
      </motion.div>

      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold font-heading">দোকানের তথ্য</h3>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={startEditing} className="text-xs gap-1.5">
              <Pencil size={12} /> সম্পাদনা
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={updateMut.isPending} className="text-xs">
                {updateMut.isPending ? "সংরক্ষণ..." : "সংরক্ষণ"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="text-xs">বাতিল</Button>
            </div>
          )}
        </div>
        {editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label className="text-xs">নাম</Label><Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9 mt-1 border-border/60" /></div>
            <div><Label className="text-xs">ক্যাটাগরি</Label><Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="h-9 mt-1 border-border/60" /></div>
            <div><Label className="text-xs">ঠিকানা</Label><Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="h-9 mt-1 border-border/60" /></div>
            <div className="sm:col-span-2"><Label className="text-xs">বিবরণ</Label><textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={2} className="w-full mt-1 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary" /></div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div><p className="text-xs text-muted-foreground">নাম</p><p className="mt-0.5 font-medium">{store.name}</p></div>
            <div><p className="text-xs text-muted-foreground">ক্যাটাগরি</p><p className="mt-0.5">{store.category || "—"}</p></div>
            <div><p className="text-xs text-muted-foreground">ঠিকানা</p><p className="mt-0.5">{store.address || "—"}</p></div>
            {store.description && <div className="sm:col-span-2"><p className="text-xs text-muted-foreground">বিবরণ</p><p className="mt-0.5">{store.description}</p></div>}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold font-heading">সাম্প্রতিক রিভিউ</h3>
          <Link href={`/my-store/${storeId}/reviews`} className="flex items-center gap-1 text-xs text-primary hover:underline">
            সব রিভিউ দেখুন <ChevronRight size={12} />
          </Link>
        </div>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">এখনো কোনো রিভিউ নেই</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={11} className={i <= r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"} />
                    ))}
                  </span>
                  <span className="text-muted-foreground">{r.user?.name}</span>
                </div>
                {r.comment && <p className="mt-1 text-sm text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: r.comment }} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location with Map */}
      {store.latitude && store.longitude && (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="p-5 pb-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold font-heading">
              <MapPin size={14} className="text-muted-foreground" /> অবস্থান
            </h3>
            {store.address && (
              <p className="mt-1 text-sm text-muted-foreground">{store.address}</p>
            )}
          </div>
          <StaticMap
            lat={store.latitude}
            lng={store.longitude}
            className="h-64 rounded-none border-0 border-t border-border/60"
          />
          <div className="p-3 border-t border-border/60">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Navigation size={12} />
              দিকনির্দেশনা পান
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
}
