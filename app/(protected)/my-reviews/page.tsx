"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { searchStores } from "@/lib/stores";
import { getReviewsByStore, deleteReview, updateReview } from "@/lib/reviews";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/animations";
import type { Store, Review } from "@/lib/types";

export default function MyReviewsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // We need to find the user's reviews. The backend doesn't have a direct
  // "my reviews" endpoint, so we load reviews from stores the user has visited.
  // As a workaround, we use a simple approach — this page shows user's reviews
  // by querying stores and filtering. In production you'd add a backend endpoint.
  const [reviews, setReviews] = useState<(Review & { storeName?: string })[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadMyReviews() {
    if (!user) return;
    setLoading(true);
    try {
      // Search with a large radius to find stores
      const stores = await searchStores(23.8103, 90.4125, 500);
      const allReviews: (Review & { storeName?: string })[] = [];
      for (const store of stores.slice(0, 20)) {
        try {
          const data = await getReviewsByStore(store.id, 1, 50);
          const myReviews = data.reviews
            .filter((r: Review) => r.user_id === user.id)
            .map((r: Review) => ({ ...r, storeName: store.name }));
          allReviews.push(...myReviews);
        } catch {
          // skip
        }
      }
      setReviews(allReviews);
    } catch {
      // skip
    }
    setLoading(false);
    setLoaded(true);
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      loadMyReviews();
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight font-heading">আমার রিভিউ ✍️</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        আপনি যেসব রিভিউ দিয়েছেন
      </p>

      {!loaded && (
        <div className="mt-8 text-center">
          <Button onClick={loadMyReviews} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                লোড হচ্ছে...
              </span>
            ) : (
              "আমার রিভিউ লোড করুন"
            )}
          </Button>
        </div>
      )}

      {loaded && reviews.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="text-5xl">📝</span>
          <h2 className="mt-4 text-lg font-semibold font-heading">কোনো রিভিউ নেই</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            আপনি এখনো কোনো রিভিউ দেননি। দোকান ভিজিট করে রিভিউ লিখুন!
          </p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-6 space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-primary/10 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{review.storeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("bn-BD")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-yellow-500">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(review.id)}
                    disabled={deleteMutation.isPending}
                    className="text-xs text-destructive hover:underline"
                  >
                    মুছুন
                  </button>
                </div>
              </div>
              {review.comment && (
                <p className="mt-3 text-sm">{review.comment}</p>
              )}
              {review.images && review.images.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {review.images.map((img) => (
                    <img key={img.id} src={img.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

