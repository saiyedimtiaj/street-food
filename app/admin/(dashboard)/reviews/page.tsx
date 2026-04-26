"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllStores } from "@/lib/stores";
import { getReviewsByStore, deleteReview } from "@/lib/reviews";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Review } from "@/lib/types";

// TODO: Add GET /admin/reviews endpoint to backend for full data
export default function AdminReviewsPage() {
  const [ratingFilter, setRatingFilter] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load reviews from first 10 stores
  const { data: storesData, isLoading: storesLoading } = useQuery({
    queryKey: ["admin", "stores-for-reviews"],
    queryFn: () => getAllStores({ page: 1, limit: 10 }),
  });

  const storeIds = storesData?.data?.map((s) => s.id) || [];
  const storeMap = Object.fromEntries((storesData?.data || []).map((s) => [s.id, s]));

  const { data: reviewsArrayData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["admin", "all-reviews", storeIds],
    queryFn: async () => {
      const results = await Promise.all(
        storeIds.map((id) => getReviewsByStore(id, 1, 100).catch(() => ({ reviews: [], total: 0, page: 1, limit: 100, totalPages: 0 })))
      );
      return results.flatMap((r) => r.reviews);
    },
    enabled: storeIds.length > 0,
  });

  const deleteMut = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => { toast("রিভিউ মুছে ফেলা হয়েছে", "success"); queryClient.invalidateQueries({ queryKey: ["admin", "all-reviews"] }); },
    onError: () => toast("সমস্যা হয়েছে", "error"),
  });

  const allReviews: Review[] = reviewsArrayData || [];
  const filtered = ratingFilter > 0 ? allReviews.filter((r) => r.rating === ratingFilter) : allReviews;
  const isLoading = storesLoading || reviewsLoading;

  const columns = [
    { key: "user", label: "ব্যবহারকারী" },
    { key: "store", label: "দোকান" },
    { key: "rating", label: "রেটিং", width: "80px" },
    { key: "comment", label: "মন্তব্য", hiddenOnMobile: true },
    { key: "date", label: "তারিখ", width: "100px", hiddenOnMobile: true },
    { key: "actions", label: "", width: "60px" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <AdminPageHeader title="রিভিউসমূহ" count={allReviews.length} subtitle="সীমিত ডেটা দেখানো হচ্ছে (প্রথম ১০টি দোকান)" />

      <div className="flex flex-wrap items-center gap-2">
        {[0, 5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => setRatingFilter(r)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: ratingFilter === r ? "var(--accent-amber)" : "var(--bg-surface)",
              color: ratingFilter === r ? "var(--bg-base)" : "var(--text-secondary)",
              border: `1px solid ${ratingFilter === r ? "transparent" : "var(--border-subtle)"}`,
            }}
          >
            {r === 0 ? "সব" : `${r}★`}
          </button>
        ))}
      </div>

      <AdminDataTable columns={columns} isLoading={isLoading} isEmpty={filtered.length === 0} skeletonRows={6} emptyMessage="কোনো রিভিউ পাওয়া যায়নি">
        {filtered.map((review) => {
          const store = storeMap[review.store_id];
          const plainComment = review.comment?.replace(/<[^>]*>/g, "") || "";
          return (
            <tr key={review.id} className="border-t transition-colors hover:bg-[var(--bg-elevated)]/50" style={{ borderColor: "var(--border-subtle)" }}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {review.user?.profile_photo ? (
                    <img src={review.user.profile_photo} alt="" className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                      {review.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>{review.user?.name || "অজানা"}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Link href={`/admin/stores/${review.store_id}`} className="text-sm hover:underline" style={{ color: "var(--accent-amber)" }}>
                  {store?.name || "—"}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="flex items-center gap-0.5" style={{ color: "var(--accent-amber)" }}>
                  {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm max-w-[200px] truncate hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>
                {plainComment.slice(0, 50) || "—"}
              </td>
              <td className="px-4 py-3 text-xs hidden md:table-cell" style={{ color: "var(--text-tertiary)" }}>
                {new Intl.DateTimeFormat("bn-BD", { dateStyle: "short" }).format(new Date(review.created_at))}
              </td>
              <td className="px-4 py-3">
                  <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-elevated)]" style={{ color: "var(--accent-ember)" }}>
                      <Trash2 size={16} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-heavy border" style={{ borderColor: "var(--border-subtle)" }}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>রিভিউ মুছতে চান?</AlertDialogTitle>
                      <AlertDialogDescription>এটি পূর্বাবস্থায় ফেরানো যাবে না।</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>বাতিল</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMut.mutate(review.id)} className="bg-destructive text-destructive-foreground">মুছুন</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          );
        })}
      </AdminDataTable>
    </div>
  );
}
