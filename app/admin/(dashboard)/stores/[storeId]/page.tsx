"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getStoreById, deleteStore } from "@/lib/stores";
import { getReviewsByStore } from "@/lib/reviews";
import { getFoodsByStore } from "@/lib/foods";
import { suspendStore, activateStore } from "@/lib/admin";
import { getStoreImage } from "@/lib/images";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { ArrowLeft, Pause, Play, Trash2, Star, MessageSquare, UtensilsCrossed, Image as ImageIcon } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "oklch(0.70 0.14 160 / 0.15)", text: "var(--accent-jade)", label: "সক্রিয়" },
  inactive: { bg: "var(--bg-elevated)", text: "var(--text-tertiary)", label: "নিষ্ক্রিয়" },
  suspended: { bg: "oklch(0.60 0.22 35 / 0.15)", text: "var(--accent-ember)", label: "স্থগিত" },
};

export default function AdminStoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: store, isLoading } = useQuery({
    queryKey: ["admin", "store", storeId],
    queryFn: () => getStoreById(storeId),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["admin", "store-reviews", storeId],
    queryFn: () => getReviewsByStore(storeId, 1, 5),
    enabled: !!store,
  });

  const { data: foods } = useQuery({
    queryKey: ["admin", "store-foods", storeId],
    queryFn: () => getFoodsByStore(storeId),
    enabled: !!store,
  });

  const suspendMut = useMutation({
    mutationFn: () => suspendStore(storeId),
    onSuccess: () => { toast("দোকান স্থগিত হয়েছে", "success"); queryClient.invalidateQueries({ queryKey: ["admin", "store", storeId] }); },
  });
  const activateMut = useMutation({
    mutationFn: () => activateStore(storeId),
    onSuccess: () => { toast("দোকান সক্রিয় হয়েছে", "success"); queryClient.invalidateQueries({ queryKey: ["admin", "store", storeId] }); },
  });
  const deleteMut = useMutation({
    mutationFn: () => deleteStore(storeId),
    onSuccess: () => { toast("দোকান মুছে ফেলা হয়েছে", "success"); router.push("/admin/stores"); },
  });

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-6 lg:p-8">
        <p style={{ color: "var(--text-tertiary)" }}>দোকান পাওয়া যায়নি</p>
      </div>
    );
  }

  const ss = statusStyles[store.status] || statusStyles.inactive;
  const reviews = reviewsData?.reviews || [];

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <Link href="/admin/stores" className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--accent-amber)]" style={{ color: "var(--text-secondary)" }}>
        <ArrowLeft size={16} /> দোকানসমূহ
      </Link>

      {/* Hero */}
      <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden">
        <img src={getStoreImage(store.cover_image, store.category)} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading text-white">{store.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {store.category && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">{store.category}</span>}
              <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: ss.bg, color: ss.text }}>{ss.label}</span>
              {store.is_claimed && <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">দাবিকৃত</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: details */}
        <div className="space-y-4">
          <div className="rounded-xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
            <h3 className="text-sm font-semibold mb-3 font-heading" style={{ color: "var(--text-primary)" }}>দোকানের তথ্য</h3>
            <dl className="space-y-2.5 text-sm">
              <div><dt className="text-xs" style={{ color: "var(--text-tertiary)" }}>বিবরণ</dt><dd style={{ color: "var(--text-secondary)" }}>{store.description || "—"}</dd></div>
              <div><dt className="text-xs" style={{ color: "var(--text-tertiary)" }}>ঠিকানা</dt><dd style={{ color: "var(--text-secondary)" }}>{store.address || "—"}</dd></div>
              <div><dt className="text-xs" style={{ color: "var(--text-tertiary)" }}>স্থানাঙ্ক</dt><dd className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>{store.latitude}, {store.longitude}</dd></div>
            </dl>
          </div>

          {/* Foods */}
          <div className="rounded-xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
            <h3 className="text-sm font-semibold mb-3 font-heading" style={{ color: "var(--text-primary)" }}>মেনু আইটেম ({foods?.length || 0})</h3>
            {foods?.length ? (
              <div className="space-y-2">
                {foods.map((food) => (
                  <div key={food.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--bg-elevated)" }}>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{food.name}</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--accent-amber)" }}>৳{food.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>কোনো মেনু আইটেম নেই</p>
            )}
          </div>
        </div>

        {/* Right: stats + reviews */}
        <div className="space-y-4">
          <div className="rounded-xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
            <h3 className="text-sm font-semibold mb-3 font-heading" style={{ color: "var(--text-primary)" }}>পরিসংখ্যান</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: "var(--accent-amber)" }}><Star size={16} fill="currentColor" /> {store.averageRating?.toFixed(1) || "—"}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>গড় রেটিং</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: "var(--accent-jade)" }}><MessageSquare size={16} /> {store.totalReviews || 0}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>মোট রিভিউ</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: "var(--accent-sky)" }}><UtensilsCrossed size={16} /> {foods?.length || 0}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>মেনু আইটেম</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg-elevated)" }}>
                <p className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: "var(--text-primary)" }}><ImageIcon size={16} /> {store.gallery?.length || 0}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>গ্যালারি</p>
              </div>
            </div>
          </div>

          {/* Recent reviews */}
          <div className="rounded-xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
            <h3 className="text-sm font-semibold mb-3 font-heading" style={{ color: "var(--text-primary)" }}>সাম্প্রতিক রিভিউ</h3>
            {reviews.length ? (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-lg px-3 py-2.5" style={{ background: "var(--bg-elevated)" }}>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-0.5" style={{ color: "var(--accent-amber)" }}>{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}</span>
                      <span style={{ color: "var(--text-tertiary)" }}>{r.user?.name || "অজানা"}</span>
                    </div>
                    {r.comment && (
                      <p className="mt-1 text-xs line-clamp-2" style={{ color: "var(--text-secondary)" }} dangerouslySetInnerHTML={{ __html: r.comment }} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>কোনো রিভিউ নেই</p>
            )}
          </div>
        </div>
      </div>

      {/* Admin actions */}
      <div className="rounded-xl border p-4 sm:p-5 flex flex-wrap gap-3" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
        {store.status !== "suspended" && (
          <button onClick={() => suspendMut.mutate()} className="flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium" style={{ background: "oklch(0.60 0.22 35 / 0.15)", color: "var(--accent-ember)" }}>
            <Pause size={14} /> স্থগিত করুন
          </button>
        )}
        {store.status !== "active" && (
          <button onClick={() => activateMut.mutate()} className="flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium" style={{ background: "oklch(0.70 0.14 160 / 0.15)", color: "var(--accent-jade)" }}>
            <Play size={14} /> সক্রিয় করুন
          </button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium" style={{ background: "oklch(0.60 0.22 35 / 0.15)", color: "var(--accent-ember)" }}>
              <Trash2 size={14} /> মুছুন
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-heavy border" style={{ borderColor: "var(--border-subtle)" }}>
            <AlertDialogHeader>
              <AlertDialogTitle>দোকান মুছতে চান?</AlertDialogTitle>
              <AlertDialogDescription>এটি পূর্বাবস্থায় ফেরানো যাবে না।</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>বাতিল</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMut.mutate()} className="bg-destructive text-destructive-foreground">মুছুন</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}
