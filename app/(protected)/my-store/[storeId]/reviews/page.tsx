"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { getReviewsByStore, addReply, editReply } from "@/lib/reviews";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import type { Review } from "@/lib/types";

export default function StoreReviewsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["store-reviews", storeId, page],
    queryFn: () => getReviewsByStore(storeId, page),
  });

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <h2 className="flex items-center gap-2 text-xl font-bold font-heading">
        <Star size={20} className="text-amber-400 fill-amber-400" /> কাস্টমার রিভিউ
      </h2>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/60 p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1.5"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
              </div>
              <Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-1.5 h-4 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {reviewsData?.reviews && reviewsData.reviews.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border/60 p-12 text-center">
          <div className="rounded-full bg-muted p-4 mx-auto w-fit">
            <MessageSquare size={32} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">এখনো কোনো রিভিউ নেই</h3>
        </div>
      )}

      {/* Reviews list */}
      {reviewsData?.reviews && reviewsData.reviews.length > 0 && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {/* Rating summary */}
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4">
            <div className="text-center px-2">
              <p className="text-2xl font-bold text-amber-400">
                {reviewsData.reviews.length > 0
                  ? (reviewsData.reviews.reduce((s: number, r: Review) => s + r.rating, 0) / reviewsData.reviews.length).toFixed(1)
                  : "—"}
              </p>
              <div className="flex items-center gap-0.5 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((i) => {
                  const avg = reviewsData.reviews.reduce((s: number, r: Review) => s + r.rating, 0) / reviewsData.reviews.length;
                  return <Star key={i} size={10} className={i <= Math.round(avg) ? "text-amber-400 fill-amber-400" : "text-muted-foreground"} />;
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">গড় রেটিং</p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewsData.reviews.filter((r: Review) => r.rating === star).length;
                const pct = reviewsData.reviews.length > 0 ? (count / reviewsData.reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground">{star}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-4 text-muted-foreground text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {reviewsData.reviews.map((review: Review) => (
            <motion.div key={review.id} variants={staggerItem}>
              <StoreReviewCard review={review} storeId={storeId} onReplied={() => queryClient.invalidateQueries({ queryKey: ["store-reviews", storeId] })} />
            </motion.div>
          ))}

          {/* Pagination */}
          {reviewsData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} className="mr-1" /> পূর্ববর্তী
              </Button>
              <span className="text-sm text-muted-foreground">{page} / {reviewsData.totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= reviewsData.totalPages} onClick={() => setPage((p) => p + 1)}>
                পরবর্তী <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function StoreReviewCard({ review, storeId, onReplied }: { review: Review; storeId: string; onReplied: () => void }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState(review.replies?.[0]?.reply_text || "");
  const hasReply = review.replies && review.replies.length > 0;
  const [editing, setEditing] = useState(false);

  const replyMutation = useMutation({
    mutationFn: () => hasReply ? editReply(review.id, replyText) : addReply(review.id, replyText),
    onSuccess: () => { setShowReplyForm(false); setEditing(false); onReplied(); },
  });

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {review.user?.profile_photo ? (
            <img src={review.user.profile_photo} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/8 text-sm font-semibold text-primary">
              {review.user?.name?.charAt(0) || "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{review.user?.name}</p>
            <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString("bn-BD")}</p>
          </div>
        </div>
        <span className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} className={i <= review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"} />
          ))}
        </span>
      </div>

      {review.comment && <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>}

      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.map((img) => (
            <img key={img.id} src={img.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ))}
        </div>
      )}

      {hasReply && !editing && (
        <div className="border-l-2 border-primary/30 pl-4 mt-4 bg-muted/30 py-3 pr-3 rounded-r-lg">
          <p className="text-xs font-medium text-muted-foreground">আপনার উত্তর</p>
          <p className="mt-1 text-sm text-muted-foreground">{review.replies![0].reply_text}</p>
          <button onClick={() => { setEditing(true); setShowReplyForm(true); }} className="mt-1 text-xs text-primary hover:underline">এডিট করুন</button>
        </div>
      )}

      {!hasReply && !showReplyForm && (
        <button onClick={() => setShowReplyForm(true)} className="mt-3 text-xs text-primary hover:underline">উত্তর দিন</button>
      )}

      {showReplyForm && (
        <div className="mt-4 border-t border-border/60 pt-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            maxLength={1000}
            rows={2}
            placeholder="আপনার উত্তর লিখুন..."
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary"
          />
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={() => replyMutation.mutate()} disabled={!replyText.trim() || replyMutation.isPending}>
              {replyMutation.isPending ? "পাঠানো হচ্ছে..." : hasReply ? "আপডেট করুন" : "উত্তর দিন"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setShowReplyForm(false); setEditing(false); }}>বাতিল</Button>
          </div>
        </div>
      )}
    </div>
  );
}
