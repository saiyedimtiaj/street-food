"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowLeft, ChevronLeft, ChevronRight, ImageIcon, Trash2, UtensilsCrossed, CircleDot, Navigation } from "lucide-react";
import { getStoreById } from "@/lib/stores";
import { getReviewsByStore, createReview, deleteReview } from "@/lib/reviews";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/tiptap-editor";
import { getStoreImage, getFoodImage } from "@/lib/images";
import { fadeInUp } from "@/lib/animations";
import type { Review, Food } from "@/lib/types";

const StaticMap = dynamic(() => import("@/components/static-map").then((m) => ({ default: m.StaticMap })), {
  ssr: false,
  loading: () => <div className="h-56 sm:h-64 rounded-xl border border-border/60 animate-pulse bg-muted/20" />,
});

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reviewPage, setReviewPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: store, isLoading, isError } = useQuery({
    queryKey: ["store", id],
    queryFn: () => getStoreById(id),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", id, reviewPage],
    queryFn: () => getReviewsByStore(id, reviewPage),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Skeleton className="h-56 w-full rounded-2xl sm:h-72" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !store) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <UtensilsCrossed size={28} className="text-muted-foreground" />
        </div>
        <h2 className="mt-5 text-lg font-semibold font-heading">দোকান পাওয়া যায়নি</h2>
        <Link href="/stores" className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft size={14} /> দোকান তালিকায় ফিরে যান
        </Link>
      </div>
    );
  }

  const coverSrc = getStoreImage(store.cover_image, store.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Cover */}
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <img
          src={coverSrc}
          alt={store.name}
          className="h-56 w-full object-cover sm:h-72 lg:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-heading">
                {store.name}
              </h1>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {store.averageRating !== undefined && store.averageRating > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    {store.averageRating.toFixed(1)}
                    <span className="text-white/60 text-xs">({store.totalReviews})</span>
                  </span>
                )}
                {store.category && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {store.category}
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
                    store.status === "active"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : store.status === "suspended"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {store.status === "active" ? "সক্রিয়" : store.status === "suspended" ? "স্থগিত" : "নিষ্ক্রিয়"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="min-w-0">
          {/* Info */}
          <section>
            {store.address && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} className="shrink-0 text-muted-foreground/60" />
                {store.address}
              </p>
            )}
            {store.description && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {store.description}
              </p>
            )}
          </section>

          {/* Gallery */}
          {store.gallery && store.gallery.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-base font-semibold font-heading">
                <ImageIcon size={16} className="text-muted-foreground" />
                গ্যালারি
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {store.gallery.map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt=""
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold font-heading">
                <Star size={16} className="text-muted-foreground" />
                রিভিউ
                {reviewsData?.total !== undefined && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({reviewsData.total})
                  </span>
                )}
              </h2>
              {user?.role === "user" && (
                <Button
                  variant={showReviewForm ? "outline" : "default"}
                  size="sm"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? "বাতিল" : "রিভিউ লিখুন"}
                </Button>
              )}
            </div>

            {showReviewForm && (
              <div className="mt-4">
                <ReviewForm
                  storeId={id}
                  onSuccess={() => {
                    setShowReviewForm(false);
                    queryClient.invalidateQueries({ queryKey: ["reviews", id] });
                    queryClient.invalidateQueries({ queryKey: ["store", id] });
                  }}
                />
              </div>
            )}

            {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
              <div className="mt-5 space-y-4">
                {reviewsData.reviews.map((review: Review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    storeId={id}
                    canDelete={user?.role === "admin" || user?.id === review.user_id}
                  />
                ))}
                {reviewsData.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={reviewPage <= 1}
                      onClick={() => setReviewPage((p) => p - 1)}
                    >
                      <ChevronLeft size={14} className="mr-1" /> পূর্ববর্তী
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {reviewPage} / {reviewsData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={reviewPage >= reviewsData.totalPages}
                      onClick={() => setReviewPage((p) => p + 1)}
                    >
                      পরবর্তী <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              !showReviewForm && (
                <div className="mt-8 flex flex-col items-center py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Star size={24} className="text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">এখনো কোনো রিভিউ নেই</p>
                </div>
              )
            )}
          </section>
        </div>

        {/* Right sidebar — Menu + Location */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {store.foods && store.foods.length > 0 ? (
            <div className="rounded-xl border border-border/60 p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold font-heading">
                <UtensilsCrossed size={16} className="text-muted-foreground" />
                মেনু
              </h2>
              <div className="mt-4 divide-y divide-border/40">
                {store.foods.map((food: Food, idx: number) => (
                  <div key={food.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <img
                      src={getFoodImage(food.image_url, idx)}
                      alt={food.name}
                      className="h-11 w-11 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{food.name}</p>
                        <span className="shrink-0 font-mono text-sm font-semibold text-primary">
                          ৳{food.price}
                        </span>
                      </div>
                      {food.description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {food.description}
                        </p>
                      )}
                    </div>
                    <CircleDot
                      size={10}
                      className={`shrink-0 ${food.is_available ? "text-emerald-500" : "text-red-400"}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border/60 p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UtensilsCrossed size={20} className="text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">মেনু এখনো যোগ করা হয়নি</p>
            </div>
          )}

          {/* Location Map */}
          {store.latitude && store.longitude && (
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <div className="p-4 pb-3">
                <h2 className="flex items-center gap-2 text-base font-semibold font-heading">
                  <MapPin size={16} className="text-muted-foreground" />
                  অবস্থান
                </h2>
                {store.address && (
                  <p className="mt-1 text-xs text-muted-foreground">{store.address}</p>
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
        </aside>
      </div>
    </div>
  );
}

function ReviewForm({ storeId, onSuccess }: { storeId: string; onSuccess: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createReview(formData),
    onSuccess: () => onSuccess(),
    onError: (err: any) => {
      setError(err.response?.data?.message || "রিভিউ দিতে সমস্যা হয়েছে");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("store_id", storeId);
    formData.append("rating", String(rating));
    const plainText = comment.replace(/<[^>]*>/g, "").trim();
    if (plainText) formData.append("comment", plainText);
    images.forEach((img) => formData.append("images", img));
    mutation.mutate(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/60 p-5">
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">রেটিং</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="transition-colors"
            >
              <Star
                size={22}
                className={n <= rating ? "text-amber-400 fill-amber-400" : "text-border"}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">মন্তব্য</label>
        <TiptapEditor
          content={comment}
          onChange={setComment}
          placeholder="আপনার অভিজ্ঞতা লিখুন..."
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium">ছবি (সর্বোচ্চ ৩টি)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 3))}
          className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/5 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary"
        />
        {images.length > 0 && (
          <p className="mt-1.5 text-xs text-muted-foreground">{images.length}টি ছবি নির্বাচিত</p>
        )}
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "জমা হচ্ছে..." : "রিভিউ জমা দিন"}
      </Button>
    </form>
  );
}

function ReviewCard({
  review,
  storeId,
  canDelete,
}: {
  review: Review;
  storeId: string;
  canDelete: boolean;
}) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteReview(review.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", storeId] });
      queryClient.invalidateQueries({ queryKey: ["store", storeId] });
    },
  });

  return (
    <div className="rounded-xl border border-border/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {review.user?.profile_photo ? (
            <img
              src={review.user.profile_photo}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/8 text-sm font-semibold text-primary">
              {review.user?.name?.charAt(0) || "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{review.user?.name}</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-border"}
                  />
                ))}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString("bn-BD")}
              </span>
            </div>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {review.comment && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
      )}

      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              alt=""
              className="h-20 w-20 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {review.replies && review.replies.length > 0 && (
        <div className="mt-4 rounded-lg border border-border/40 p-3">
          <p className="text-xs font-semibold text-muted-foreground">দোকানের উত্তর</p>
          <p className="mt-1 text-sm leading-relaxed">{review.replies[0].reply_text}</p>
        </div>
      )}
    </div>
  );
}

