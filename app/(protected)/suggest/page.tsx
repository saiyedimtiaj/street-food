"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createSuggestion } from "@/lib/suggestions";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp } from "@/lib/animations";

const MapPicker = dynamic(() => import("@/components/map-picker").then(m => ({ default: m.MapPicker })), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-80 w-full items-center justify-center rounded-2xl border border-primary/10 bg-muted/20">
      <div className="flex flex-col items-center gap-2">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-xs text-muted-foreground">ম্যাপ লোড হচ্ছে...</span>
      </div>
    </div>
  ),
});

const DEFAULT_LAT = 22.3565;
const DEFAULT_LNG = 91.8199;

const CATEGORIES = [
  { label: "🍿 Snacks", value: "Snacks" },
  { label: "🍛 Biriyani", value: "Biriyani" },
  { label: "🦐 Seafood", value: "Seafood" },
  { label: "🍰 Desserts", value: "Desserts" },
  { label: "🥤 Beverages", value: "Beverages" },
  { label: "🍲 Traditional", value: "Traditional" },
  { label: "🔥 BBQ & Grill", value: "BBQ & Grill" },
  { label: "🍜 Noodles & Soup", value: "Noodles & Soup" },
  { label: "🥟 Dumplings", value: "Dumplings" },
  { label: "☕ Tea & Beverages", value: "Tea & Beverages" },
  { label: "🌯 Street Snacks", value: "Street Snacks" },
  { label: "🫓 Chaat & Snacks", value: "Chaat & Snacks" },
];

export default function SuggestPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lng, setLng] = useState(DEFAULT_LNG);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createSuggestion,
    onSuccess: () => {
      toast("সাজেশন সফলভাবে জমা হয়েছে!", "success");
      router.push("/my-suggestions");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "সাজেশন জমা দিতে সমস্যা হয়েছে");
    },
  });

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }, []);

  function handleMapSelect(newLat: number, newLng: number) {
    setLat(newLat);
    setLng(newLng);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    mutation.mutate({
      name,
      description: description || undefined,
      address: address || undefined,
      latitude: lat,
      longitude: lng,
    });
  }

  const filledFields = [name, category, description, address].filter(Boolean).length;
  const progress = Math.min(Math.round((filledFields / 4) * 100), 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary mb-3">
            💡 কমিউনিটিতে যুক্ত করুন
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl font-heading">
            নতুন দোকান সাজেস্ট করুন
          </h1>
          <p className="mt-1.5 max-w-lg text-sm text-muted-foreground leading-relaxed">
            আপনার পরিচিত কোনো স্ট্রিট ফুডের দোকান আমাদের প্ল্যাটফর্মে নেই? তথ্য দিন, যাচাই করে আমরা যুক্ত করব।
          </p>
        </div>
        {/* Progress */}
        <div className="flex items-center gap-3 rounded-xl border border-primary/10 px-4 py-3 sm:min-w-48">
          <div className="relative h-10 w-10 shrink-0">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/40" />
              <circle
                cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeDasharray={`${progress * 0.94} 100`}
                strokeLinecap="round"
                className="text-primary transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
              {progress}%
            </span>
          </div>
          <div>
            <p className="text-xs font-medium">{filledFields}/৪ ফিল্ড</p>
            <p className="text-[11px] text-muted-foreground">সম্পন্ন হয়েছে</p>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left — Form fields */}
          <div className="space-y-6 lg:col-span-3">
            {/* Name */}
            <div className="rounded-2xl border border-primary/10 p-5">
              <Label className="text-sm font-semibold mb-3 block">
                দোকানের নাম <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="যেমন: মামুর চায়ের দোকান"
                className="h-12 text-base"
              />
            </div>

            {/* Category */}
            <div className="rounded-2xl border border-primary/10 p-5">
              <Label className="text-sm font-semibold mb-3 block">ক্যাটাগরি</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.value}
                    onClick={() => setCategory(category === cat.value ? "" : cat.value)}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                      category === cat.value
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-primary/10 p-5">
              <Label className="text-sm font-semibold mb-3 block">বিবরণ</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="দোকান সম্পর্কে কিছু লিখুন — কী খাবার বিখ্যাত, দাম কেমন, পরিবেশ কেমন..."
                className="w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus-visible:border-ring placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Address & Contact */}
            <div className="rounded-2xl border border-primary/10 p-5 space-y-4">
              <Label className="text-sm font-semibold block">ঠিকানা ও যোগাযোগ</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="যেমন: স্টেশন রোড, চট্টগ্রাম"
                className="h-11"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] text-muted-foreground">ফোন নম্বর</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] text-muted-foreground">খোলার সময়</Label>
                  <Input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] text-muted-foreground">বন্ধের সময়</Label>
                  <Input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Map & Submit */}
          <div className="space-y-5 lg:col-span-2">
            <div className="sticky top-24 space-y-5">
              {/* Map card */}
              <div className="rounded-2xl border border-primary/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold">লোকেশন নির্বাচন</Label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                  >
                    {locating ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-primary border-t-transparent" />
                        খুঁজছি...
                      </>
                    ) : (
                      <>📍 আমার লোকেশন</>
                    )}
                  </button>
                </div>

                <div className="overflow-hidden rounded-xl">
                  <MapPicker lat={lat} lng={lng} onLocationSelect={handleMapSelect} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Lat</Label>
                    <Input
                      value={lat.toFixed(6)}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!isNaN(v)) setLat(v);
                      }}
                      className="h-9 font-mono text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Lng</Label>
                    <Input
                      value={lng.toFixed(6)}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!isNaN(v)) setLng(v);
                      }}
                      className="h-9 font-mono text-xs"
                    />
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] text-muted-foreground/70 leading-relaxed">
                  ম্যাপে ক্লিক করুন বা মার্কার ড্র্যাগ করে সঠিক অবস্থান নির্ধারণ করুন।
                </p>
              </div>

              {/* Submit card */}
              <div className="rounded-2xl border border-primary/10 p-5">
                <Button
                  type="submit"
                  disabled={mutation.isPending || !name}
                  className="w-full h-12 text-base font-semibold"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      জমা হচ্ছে...
                    </span>
                  ) : (
                    <>সাজেশন জমা দিন</>
                  )}
                </Button>
                {!name && (
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    দোকানের নাম আবশ্যক
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
