"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { updateProfile } from "@/lib/users";
import { useToast } from "@/components/ui/toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/animations";

export default function SettingsPage() {
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: () => {
      toast("প্রোফাইল আপডেট হয়েছে", "success");
      setError("");
      refetchUser();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে");
    },
  });

  if (!user) return null;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData();
    if (name !== user.name) formData.append("name", name);
    if (bio !== (user.bio || "")) formData.append("bio", bio);
    if (photo) formData.append("profile_photo", photo);
    mutation.mutate(formData);
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight font-heading">সেটিংস ⚙️</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        আপনার অ্যাকাউন্ট সেটিংস পরিবর্তন করুন
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        <div className="rounded-xl border border-primary/10 p-6">
          <h2 className="text-sm font-semibold text-foreground font-heading">প্রোফাইল তথ্য</h2>
          <p className="mt-1 text-xs text-muted-foreground">আপনার নাম, বায়ো ও ছবি পরিবর্তন করুন</p>

          <div className="mt-5 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm">নাম</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 border-primary/10 bg-secondary/30 focus-visible:border-primary/40"
                minLength={2}
                maxLength={100}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bio" className="text-sm">বায়ো</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                className="w-full rounded-lg border border-primary/10 bg-secondary/30 px-3 py-2 text-sm outline-none transition-colors focus-visible:border-primary/40 placeholder:text-muted-foreground/40"
              />
              <p className="text-xs text-muted-foreground">{bio.length}/৫০০</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm">ইমেইল</Label>
              <Input id="email" defaultValue={user.email} className="h-10 border-primary/10 bg-secondary/30" disabled />
              <p className="text-xs text-muted-foreground">ইমেইল পরিবর্তন করা যাবে না</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="photo" className="text-sm">প্রোফাইল ছবি</Label>
              <input
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="text-sm text-muted-foreground"
              />
            </div>
            <Button type="submit" size="sm" disabled={mutation.isPending}>
              {mutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

