"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Store as StoreIcon, Star, MessageSquare, UtensilsCrossed, Pencil, Image as ImageIcon, ChevronLeft, ChevronRight, MapPin, X, Upload, LocateFixed } from "lucide-react";
import { getMyStores, createStore } from "@/lib/stores";
import { getStoreImage } from "@/lib/images";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staggerContainer, staggerItem, modalEnter } from "@/lib/animations";
import type { Store } from "@/lib/types";

const MapPicker = dynamic(() => import("@/components/map-picker").then((m) => ({ default: m.MapPicker })), {
  ssr: false,
  loading: () => <div className="h-80 rounded-xl border border-border/60 animate-pulse bg-muted/20" />,
});

const CATEGORIES = [
  { label: "Biriyani" },
  { label: "Noodles & Soup" },
  { label: "Street Snacks" },
  { label: "BBQ & Grill" },
  { label: "Tea & Beverages" },
  { label: "Desserts" },
  { label: "Seafood" },
  { label: "Traditional" },
];

export default function MyStoresHubPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (user?.role !== "store") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <p className="text-muted-foreground">এই পেজ শুধু দোকানদারদের জন্য</p>
      </div>
    );
  }

  return <StoresHubContent showModal={showModal} setShowModal={setShowModal} />;
}

function StoresHubContent({ showModal, setShowModal }: { showModal: boolean; setShowModal: (v: boolean) => void }) {
  const queryClient = useQueryClient();

  const { data: stores, isLoading } = useQuery({
    queryKey: ["my-stores"],
    queryFn: getMyStores,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">আমার দোকানসমূহ</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">আপনার সকল দোকান পরিচালনা করুন</p>
        </div>
        <Button onClick={() => setShowModal(true)} size="sm">
          <Plus size={16} className="mr-1.5" /> নতুন দোকান
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <StoreOwnerCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {stores && stores.length === 0 && (
        <div className="mt-16 flex flex-col items-center rounded-2xl border-2 border-dashed border-border/60 p-16 text-center">
          <div className="rounded-full bg-muted p-5">
            <StoreIcon size={28} className="text-muted-foreground" />
          </div>
          <h2 className="mt-5 text-lg font-semibold font-heading">এখনো কোনো দোকান নেই</h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">আপনার প্রথম দোকান তৈরি করুন এবং কাস্টমারদের সাথে যুক্ত হন</p>
          <Button onClick={() => setShowModal(true)} className="mt-6">
            <Plus size={16} className="mr-1.5" /> আপনার প্রথম দোকান যোগ করুন
          </Button>
        </div>
      )}

      {/* Store cards grid */}
      {stores && stores.length > 0 && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map((store) => (
            <motion.div key={store.id} variants={staggerItem}>
              <StoreOwnerCard store={store} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create store modal */}
      <CreateStoreModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          queryClient.invalidateQueries({ queryKey: ["my-stores"] });
        }}
      />
    </div>
  );
}

function StoreOwnerCard({ store }: { store: Store }) {
  const statusMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    active:    { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400", label: "সক্রিয়" },
    inactive:  { bg: "bg-muted",          text: "text-muted-foreground", dot: "bg-muted-foreground", label: "নিষ্ক্রিয়" },
    suspended: { bg: "bg-red-500/15",     text: "text-red-400",    dot: "bg-red-400",    label: "স্থগিত" },
  };
  const s = statusMap[store.status] || statusMap.inactive;

  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-colors">

      {/* ── Cover image ── */}
      <Link href={`/my-store/${store.id}`} className="relative block h-48 overflow-hidden group">
        <img
          src={getStoreImage(store.cover_image, store.category)}
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${s.bg} ${s.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>

        {/* Category */}
        {store.category && (
          <span className="absolute top-3 right-3 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white/90">
            {store.category}
          </span>
        )}

        {/* Name + address over image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-bold font-heading text-white leading-tight">{store.name}</h3>
          {store.address && (
            <p className="mt-1 flex items-center gap-1 text-xs text-white/60 truncate">
              <MapPin size={10} className="shrink-0" /> {store.address}
            </p>
          )}
        </div>
      </Link>

      {/* ── Stats divider row ── */}
      <div className="grid grid-cols-3 divide-x divide-border/60 border-b border-border/60">
        <div className="py-3 px-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold">{store.averageRating?.toFixed(1) || "—"}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">রেটিং</p>
        </div>
        <div className="py-3 px-2 text-center">
          <span className="text-sm font-bold">{store.totalReviews || 0}</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">রিভিউ</p>
        </div>
        <div className="py-3 px-2 text-center">
          <span className="text-sm font-bold">{store.foods?.length || 0}</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">আইটেম</p>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="p-3 grid grid-cols-4 gap-2">
        <Link href={`/my-store/${store.id}`} className="col-span-1">
          <Button variant="default" size="sm" className="w-full h-8 text-xs gap-1.5">
            <Pencil size={11} /> ম্যানেজ
          </Button>
        </Link>
        <Link href={`/my-store/${store.id}/menu`} className="col-span-1">
          <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1 border-border/60">
            <UtensilsCrossed size={11} /> মেনু
          </Button>
        </Link>
        <Link href={`/my-store/${store.id}/gallery`} className="col-span-1">
          <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1 border-border/60">
            <ImageIcon size={11} /> ছবি
          </Button>
        </Link>
        <Link href={`/my-store/${store.id}/reviews`} className="col-span-1">
          <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1 border-border/60">
            <MessageSquare size={11} /> রিভিউ
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StoreOwnerCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Skeleton className="w-full h-48" />
      <div className="grid grid-cols-3 divide-x divide-border/60 border-b border-border/60">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-3 px-2 flex flex-col items-center gap-1.5">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-2.5 w-10" />
          </div>
        ))}
      </div>
      <div className="p-3 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 rounded-md" />)}
      </div>
    </div>
  );
}

/* ─── Create Store Modal ─── */
function CreateStoreModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleLocationSelect = useCallback((newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createStore(formData),
    onSuccess: () => {
      toast("দোকান সফলভাবে তৈরি হয়েছে!", "success");
      resetForm();
      onSuccess();
    },
    onError: (err: any) => {
      toast(err.response?.data?.message || "দোকান তৈরি করতে সমস্যা হয়েছে", "error");
    },
  });

  function resetForm() {
    setStep(1);
    setName("");
    setDescription("");
    setCategory("");
    setAddress("");
    setLat(null);
    setLng(null);
    setCover(null);
    setCoverPreview(null);
  }

  function goNext() { setDirection(1); setStep((s) => Math.min(s + 1, 3)); }
  function goBack() { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); }

  function handleSubmit() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("latitude", String(lat || 23.8103));
    formData.append("longitude", String(lng || 90.4125));
    if (description) formData.append("description", description);
    if (category) formData.append("category", category);
    if (address) formData.append("address", address);
    if (cover) formData.append("cover_image", cover);
    mutation.mutate(formData);
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  function handleGetLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
    });
  }

  const STEPS = [
    { num: 1, label: "মূল তথ্য" },
    { num: 2, label: "অবস্থান" },
    { num: 3, label: "কভার ছবি" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            variants={modalEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-2xl w-full max-w-2xl overflow-hidden border border-border/60 bg-card"
          >
            {/* Progress */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {s.num}
                    </div>
                    <span className={`hidden sm:inline text-xs font-medium ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                    {i < STEPS.length - 1 && <div className="hidden sm:block w-8 h-px bg-border mx-2" />}
                  </div>
                ))}
              </div>
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  animate={{ width: `${(step / 3) * 100}%` }}
                  className="h-full rounded-full bg-primary"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step content */}
            <div className="px-6 pb-6 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm">দোকানের নাম *</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার দোকানের নাম" className="h-10 border-border/60" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm">ক্যাটাগরি</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {CATEGORIES.map((c) => (
                            <button
                              key={c.label}
                              type="button"
                              onClick={() => setCategory(c.label)}
                              className={`rounded-xl border p-3 text-center text-xs transition-all ${
                                category === c.label ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/40"
                              }`}
                            >
                              <p className={category === c.label ? "text-primary font-medium" : "text-muted-foreground"}>{c.label}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm">বিবরণ</Label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-primary placeholder:text-muted-foreground/40"
                          placeholder="দোকানের সম্পর্কে কিছু লিখুন..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm">ঠিকানা</Label>
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="দোকানের ঠিকানা" className="h-10 border-border/60" />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="h-80 rounded-xl overflow-hidden">
                        <MapPicker lat={lat || 23.8103} lng={lng || 90.4125} onLocationSelect={handleLocationSelect} />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label className="text-xs text-muted-foreground">অক্ষাংশ</Label>
                          <Input value={lat?.toFixed(6) || ""} readOnly className="h-9 font-mono text-xs border-border/60" />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs text-muted-foreground">দ্রাঘিমাংশ</Label>
                          <Input value={lng?.toFixed(6) || ""} readOnly className="h-9 font-mono text-xs border-border/60" />
                        </div>
                      </div>
                      <button type="button" onClick={handleGetLocation} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                        <LocateFixed size={12} /> আমার অবস্থান ব্যবহার করুন
                      </button>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      {coverPreview ? (
                        <div className="relative rounded-xl overflow-hidden">
                          <img src={coverPreview} alt="Preview" className="w-full h-48 object-cover" />
                          <button
                            onClick={() => { setCover(null); setCoverPreview(null); }}
                            className="absolute top-3 right-3 flex items-center justify-center h-7 w-7 rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-border/60 cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/5">
                          <Upload size={28} className="text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">ক্লিক করুন বা ড্র্যাগ করুন</span>
                          <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — সর্বোচ্চ 5MB</span>
                          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="hidden" />
                        </label>
                      )}
                      <button type="button" onClick={() => handleSubmit()} className="text-xs text-muted-foreground hover:text-foreground">
                        পরে যোগ করুন →
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-6 pb-6 gap-3">
              <div>
                {step > 1 && (
                  <Button variant="ghost" size="sm" onClick={goBack}>
                    <ChevronLeft size={14} className="mr-1" /> পূর্ববর্তী
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { resetForm(); onClose(); }}>বাতিল</Button>
                {step < 3 ? (
                  <Button size="sm" onClick={goNext} disabled={step === 1 && !name.trim()}>
                    পরবর্তী <ChevronRight size={14} className="ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSubmit} disabled={mutation.isPending || !name.trim()}>
                    {mutation.isPending ? "তৈরি হচ্ছে..." : "দোকান তৈরি করুন"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
