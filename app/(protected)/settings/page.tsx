"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { updateProfile } from "@/lib/users";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user, refetchUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: () => {
      setSuccess("প্রোফাইল আপডেট হয়েছে");
      setError("");
      refetchUser();
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে");
      setSuccess("");
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">সেটিংস ⚙️</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        আপনার অ্যাকাউন্ট সেটিংস পরিবর্তন করুন
      </p>

      {success && (
        <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        <div className="rounded-xl border border-border/60 p-6">
          <h2 className="text-sm font-semibold text-foreground">প্রোফাইল তথ্য</h2>
          <p className="mt-1 text-xs text-muted-foreground">আপনার নাম, বায়ো ও ছবি পরিবর্তন করুন</p>

          <div className="mt-5 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm">নাম</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
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
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring"
              />
              <p className="text-xs text-muted-foreground">{bio.length}/৫০০</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm">ইমেইল</Label>
              <Input id="email" defaultValue={user.email} className="h-10" disabled />
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
    </div>
  );
}
