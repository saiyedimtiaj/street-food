"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getStoreById } from "@/lib/stores";
import { getReviewsByStore, createReview, deleteReview } from "@/lib/reviews";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/tiptap-editor";
import { getStoreImage, getFoodImage } from "@/lib/images";
import type { Review, Food } from "@/lib/types";
import { Car, Bike, Bus, Navigation2, Clock, Banknote, MapPin, Loader2, AlertCircle, LocateFixed } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RouteResult {
  profile: string;
  distanceM: number;
  durationS: number;
  error?: boolean;
}

// ── Route helpers ─────────────────────────────────────────────────────────────
function fmtDist(m: number) {
  if (m < 1000) return `${Math.round(m)} মিটার`;
  return `${(m / 1000).toFixed(1)} কিমি`;
}
function fmtTime(s: number) {
  const m = Math.round(s / 60);
  if (m < 60) return `${m} মিনিট`;
  return `${Math.floor(m / 60)} ঘণ্টা ${m % 60} মিনিট`;
}
function estimateCost(distanceM: number, mode: string): string {
  const km = distanceM / 1000;
  if (mode === "car") return `৳${Math.round(Math.max(30, km * 12))}`;
  if (mode === "cng")  return `৳${Math.round(Math.max(40, km * 18))}`;
  if (mode === "bus")  return `৳${Math.round(Math.max(10, km * 3))}`;
  return "বিনামূল্যে";
}

const TRANSPORT_MODES = [
  { id: "car",    orsProfile: "driving-car",      label: "গাড়ি",     labelEn: "Car",     icon: Car,        showIfKm: Infinity },
  { id: "cng",    orsProfile: "driving-car",      label: "সিএনজি",   labelEn: "CNG",     icon: Bus,        showIfKm: 20 },
  { id: "bike",   orsProfile: "cycling-regular",  label: "সাইকেল",   labelEn: "Bicycle", icon: Bike,       showIfKm: 15 },
  { id: "walk",   orsProfile: "foot-walking",     label: "হেঁটে",    labelEn: "Walk",    icon: Navigation2,showIfKm: 5 },
  { id: "bus",    orsProfile: "driving-car",      label: "বাস",      labelEn: "Bus",     icon: Bus,        showIfKm: Infinity },
];

// ── StoreRoutes Component ─────────────────────────────────────────────────────
function StoreRoutes({ lat, lng }: { lat: number; lng: number }) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Record<string, RouteResult>>({});
  const [activeMode, setActiveMode] = useState("car");

  const fetchRoutes = useCallback(async (pos: { lat: number; lng: number }) => {
    const key = process.env.NEXT_PUBLIC_ORS_API_KEY;
    if (!key || key === "your_openrouteservice_api_key_here") {
      setError("OpenRouteService API key সেট করা হয়নি।");
      return;
    }
    const profiles = ["driving-car", "cycling-regular", "foot-walking"];
    const fetched: Record<string, RouteResult> = {};
    await Promise.all(
      profiles.map(async (profile) => {
        try {
          const url = `https://api.openrouteservice.org/v2/directions/${profile}?start=${pos.lng},${pos.lat}&end=${lng},${lat}&api_key=${key}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error();
          const data = await res.json();
          const summary = data.features?.[0]?.properties?.summary;
          if (!summary) throw new Error();
          fetched[profile] = { profile, distanceM: summary.distance, durationS: summary.duration };
        } catch {
          fetched[profile] = { profile, distanceM: 0, durationS: 0, error: true };
        }
      })
    );
    setResults(fetched);
  }, [lat, lng]);

  async function getLocation() {
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(p);
        await fetchRoutes(p);
        setLoading(false);
      },
      () => { setError("অবস্থান পাওয়া যায়নি। Location access দিন।"); setLoading(false); }
    );
  }

  const getRouteData = (mode: typeof TRANSPORT_MODES[0]) => {
    const raw = results[mode.orsProfile];
    if (!raw || raw.error) return null;
    return raw;
  };

  const activeTransport = TRANSPORT_MODES.find((m) => m.id === activeMode)!;
  const activeData = userPos ? getRouteData(activeTransport) : null;
  const distKm = activeData ? activeData.distanceM / 1000 : 0;
  const visibleModes = userPos
    ? TRANSPORT_MODES.filter((m) => {
        const d = getRouteData(m);
        return d ? d.distanceM / 1000 <= m.showIfKm : m.id === "car" || m.id === "bus";
      })
    : TRANSPORT_MODES;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={16} className="text-muted-foreground" />
        <h2 className="text-base font-semibold">কিভাবে যাবেন</h2>
      </div>

      {!userPos ? (
        <div className="rounded-xl border border-border/40 p-6 text-center">
          <LocateFixed size={28} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">আপনার বর্তমান অবস্থান থেকে এই দোকানে পৌঁছানোর সব সম্ভাব্য পথ দেখতে অবস্থান শেয়ার করুন।</p>
          {error && (
            <div className="mb-3 flex items-center justify-center gap-1.5 text-sm text-destructive">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <Button onClick={getLocation} disabled={loading} size="sm">
            {loading ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <LocateFixed size={14} className="mr-1.5" />}
            {loading ? "অবস্থান নেওয়া হচ্ছে..." : "আমার অবস্থান শেয়ার করুন"}
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 overflow-hidden">
          {/* Mode tabs */}
          <div className="flex border-b border-border/40 overflow-x-auto">
            {visibleModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeMode === mode.id
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={14} /> {mode.label}
                </button>
              );
            })}
          </div>

          {/* Route details */}
          <div className="p-5">
            {activeData ? (
              <div className="space-y-4">
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border/40 p-3 text-center">
                    <MapPin size={16} className="mx-auto mb-1 text-muted-foreground" />
                    <p className="text-base font-bold">{fmtDist(activeData.distanceM)}</p>
                    <p className="text-xs text-muted-foreground">দূরত্ব</p>
                  </div>
                  <div className="rounded-lg border border-border/40 p-3 text-center">
                    <Clock size={16} className="mx-auto mb-1 text-muted-foreground" />
                    <p className="text-base font-bold">
                      {activeTransport.id === "bus"
                        ? fmtTime(activeData.durationS * 1.4)
                        : fmtTime(activeData.durationS)}
                    </p>
                    <p className="text-xs text-muted-foreground">আনুমানিক সময়</p>
                  </div>
                  <div className="rounded-lg border border-border/40 p-3 text-center">
                    <Banknote size={16} className="mx-auto mb-1 text-muted-foreground" />
                    <p className="text-base font-bold">{estimateCost(activeData.distanceM, activeTransport.id)}</p>
                    <p className="text-xs text-muted-foreground">আনুমানিক খরচ</p>
                  </div>
                </div>

                {/* Extra info per mode */}
                <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm text-muted-foreground space-y-1">
                  {activeTransport.id === "car" && <p>ব্যক্তিগত গাড়ি বা রাইড-শেয়ার (পাঠাও/উবার) ব্যবহার করুন। পার্কিং খুঁজে নিন।</p>}
                  {activeTransport.id === "cng" && <p>সিএনজি বা অটোরিকশা — মিটারে চাপলে সাশ্রয়ী। আগে দর ঠিক করুন।</p>}
                  {activeTransport.id === "bike" && <p>সাইকেলে যাওয়া পরিবেশবান্ধব ও স্বাস্থ্যকর। হেলমেট পরুন।</p>}
                  {activeTransport.id === "walk" && <p>হেঁটে গেলে স্বাস্থ্য ভালো থাকে। নিরাপদ ফুটপাত ব্যবহার করুন।</p>}
                  {activeTransport.id === "bus" && <p>স্থানীয় বাসে খরচ কম। সময় একটু বেশি লাগতে পারে। গুগল ম্যাপে বাস রুট দেখুন।</p>}
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${lat},${lng}&travelmode=${
                    activeTransport.id === "car" || activeTransport.id === "cng" || activeTransport.id === "bus" ? "driving"
                    : activeTransport.id === "bike" ? "bicycling" : "walking"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border/40 py-2.5 text-sm font-medium transition-colors hover:bg-muted/40"
                >
                  <Navigation2 size={14} /> Google Maps-এ খুলুন
                </a>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">এই পথের তথ্য পাওয়া যায়নি।</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !store) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <span className="text-5xl">😕</span>
        <h2 className="mt-4 text-lg font-semibold">দোকান পাওয়া যায়নি</h2>
        <Link href="/stores" className="mt-3 inline-block text-sm text-primary hover:underline">
          ← দোকান তালিকায় ফিরে যান
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
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {store.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {store.averageRating !== undefined && store.averageRating > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    <span className="text-yellow-400">★</span> {store.averageRating.toFixed(1)}
                    <span className="text-white/70">({store.totalReviews})</span>
                  </span>
                )}
                {store.category && (
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {store.category}
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
                    store.status === "active"
                      ? "bg-green-500/30 text-green-200"
                      : store.status === "suspended"
                      ? "bg-red-500/30 text-red-200"
                      : "bg-yellow-500/30 text-yellow-200"
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
              <p className="text-sm text-muted-foreground">📍 {store.address}</p>
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
              <h2 className="text-lg font-semibold">গ্যালারি</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {store.gallery.map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt=""
                    className="aspect-4/3 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Route Finder */}
          {store.latitude && store.longitude && (
            <StoreRoutes lat={Number(store.latitude)} lng={Number(store.longitude)} />
          )}

          {/* Reviews */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                রিভিউ
                {reviewsData?.total !== undefined && (
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground">
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
                      ← পূর্ববর্তী
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
                      পরবর্তী →
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              !showReviewForm && (
                <div className="mt-8 py-10 text-center">
                  <span className="text-4xl">📝</span>
                  <p className="mt-3 text-sm text-muted-foreground">এখনো কোনো রিভিউ নেই</p>
                </div>
              )
            )}
          </section>
        </div>

        {/* Right sidebar — Menu */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {store.foods && store.foods.length > 0 ? (
            <div className="rounded-xl border border-border/40 p-5">
              <h2 className="text-lg font-semibold">মেনু</h2>
              <div className="mt-4 space-y-3">
                {store.foods.map((food: Food, idx: number) => (
                  <div key={food.id} className="flex items-center gap-3">
                    <img
                      src={getFoodImage(food.image_url, idx)}
                      alt={food.name}
                      className="h-12 w-12 rounded-lg object-cover"
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
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        food.is_available ? "bg-green-500" : "bg-red-400"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 p-5 text-center">
              <span className="text-3xl">🍽️</span>
              <p className="mt-2 text-sm text-muted-foreground">মেনু এখনো যোগ করা হয়নি</p>
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
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/40 p-5">
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">রেটিং</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-2xl transition-colors ${
                n <= rating ? "text-yellow-500" : "text-border"
              }`}
            >
              ★
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
    <div className="rounded-xl border border-border/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {review.user?.profile_photo ? (
            <img
              src={review.user.profile_photo}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {review.user?.name?.charAt(0) || "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{review.user?.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-yellow-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
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
            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            মুছুন
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
        <div className="mt-4 rounded-lg bg-muted/30 p-3">
          <p className="text-xs font-semibold text-muted-foreground">🏪 দোকানের উত্তর</p>
          <p className="mt-1 text-sm leading-relaxed">{review.replies[0].reply_text}</p>
        </div>
      )}
    </div>
  );
}
