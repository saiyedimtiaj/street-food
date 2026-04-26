"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { updateProfile } from "@/lib/users";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp } from "@/lib/animations";

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoFileRef = useRef<File | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      refetchUser();
      setEditing(false);
      toast("প্রোফাইল সফলভাবে আপডেট হয়েছে", "success");
      setPhotoPreview(null);
      photoFileRef.current = null;
    },
  });

  if (!user) return null;

  const roleLabel =
    user.role === "admin" ? "অ্যাডমিন" : user.role === "store" ? "দোকানদার" : "ব্যবহারকারী";
  const roleEmoji =
    user.role === "admin" ? "🛡️" : user.role === "store" ? "🏪" : "👤";

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    photoFileRef.current = file;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (photoFileRef.current) {
      formData.append("profile_photo", photoFileRef.current);
    }
    mutation.mutate(formData);
  }

  function handleCancel() {
    setEditing(false);
    setName(user?.name || "");
    setBio(user?.bio || "");
    setPhotoPreview(null);
    photoFileRef.current = null;
  }

  const displayPhoto = photoPreview || user.profile_photo;
  const joinDate = new Date(user.created_at);
  const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Profile card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-5">
            {/* Avatar card */}
            <div className="rounded-2xl border border-primary/10 overflow-hidden">
              {/* Decorative top band */}
              <div className="h-20 bg-linear-to-br from-primary/20 via-primary/10 to-amber-500/10" />
              <div className="px-5 pb-5">
                {/* Avatar */}
                <div className="relative -mt-10 mb-4">
                  {displayPhoto ? (
                    <img
                      src={displayPhoto}
                      alt={user.name}
                      className="h-20 w-20 rounded-2xl border-4 border-background object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary/10 text-2xl font-bold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {editing && (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] text-primary-foreground transition-transform hover:scale-110"
                    >
                      📷
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>

                {/* Name */}
                {editing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 text-lg font-bold mb-1"
                  />
                ) : (
                  <h1 className="text-lg font-bold tracking-tight">{user.name}</h1>
                )}
                <p className="text-sm text-muted-foreground">{user.email}</p>

                {/* Role badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <span>{roleEmoji}</span> {roleLabel}
                </div>

                {/* Action buttons */}
                <div className="mt-5 border-t border-primary/10 pt-4">
                  {!editing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="w-full gap-2"
                    >
                      ✏️ প্রোফাইল সম্পাদনা
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={mutation.isPending}
                        className="flex-1"
                      >
                        বাতিল
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="flex-1"
                      >
                        {mutation.isPending ? (
                          <span className="flex items-center gap-1.5">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            সেভ...
                          </span>
                        ) : (
                          "সেভ করুন"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-primary/10 p-4 text-center">
                <p className="text-2xl font-bold text-primary">{daysSinceJoin}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">দিন আগে যুক্ত</p>
              </div>
              <div className="rounded-2xl border border-primary/10 p-4 text-center">
                <p className="text-2xl font-bold">
                  {user.is_active ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {user.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div className="space-y-5 lg:col-span-2">
          {/* Bio */}
          <div className="rounded-2xl border border-primary/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span>📝</span> সম্পর্কে
              </h2>
              {editing && (
                <span className="text-[11px] text-muted-foreground">সর্বোচ্চ ৩০০ অক্ষর</span>
              )}
            </div>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                rows={4}
                placeholder="আপনার সম্পর্কে কিছু লিখুন — কী খেতে ভালোবাসেন, কোথাকার মানুষ..."
                className="w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus-visible:border-ring placeholder:text-muted-foreground/40"
              />
            ) : user.bio ? (
              <p className="text-sm leading-relaxed">{user.bio}</p>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <span className="text-3xl opacity-30">📝</span>
                <p className="text-sm text-muted-foreground">কোনো বায়ো যুক্ত করা হয়নি</p>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  বায়ো যুক্ত করুন →
                </button>
              </div>
            )}
          </div>

          {/* Account info */}
          <div className="rounded-2xl border border-primary/10 p-6">
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-5">
              <span>⚙️</span> অ্যাকাউন্ট তথ্য
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-primary/5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-sm">📧</div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">ইমেইল</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-primary/5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-sm">🏷️</div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">ভূমিকা</p>
                    <p className="text-sm font-medium">{roleLabel}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-primary/5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-sm">🔒</div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">স্ট্যাটাস</p>
                    <p className="text-sm font-medium">
                      {user.is_active ? (
                        <span className="text-green-600 dark:text-green-400">সক্রিয় ✓</span>
                      ) : (
                        <span className="text-red-500">নিষ্ক্রিয়</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-sm">📅</div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">যোগদান</p>
                    <p className="text-sm font-medium">
                      {joinDate.toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="rounded-2xl border border-primary/10 p-6">
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <span>🔐</span> নিরাপত্তা
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              আপনার অ্যাকাউন্ট সুরক্ষিত আছে। পাসওয়ার্ড পরিবর্তন বা অ্যাকাউন্ট সংক্রান্ত
              সমস্যার জন্য সেটিংস পেজে যান।
            </p>
            <a
              href="/settings"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              সেটিংস → 
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

