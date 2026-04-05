"use client";

import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const roleLabel =
    user.role === "admin" ? "অ্যাডমিন" : user.role === "store" ? "দোকানদার" : "ব্যবহারকারী";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">প্রোফাইল 👤</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        আপনার অ্যাকাউন্টের তথ্য
      </p>

      <div className="mt-8 rounded-xl border border-border/60 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="text-sm text-muted-foreground">ভূমিকা</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {roleLabel}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="text-sm text-muted-foreground">অ্যাকাউন্ট স্ট্যাটাস</span>
            <span className="text-sm font-medium text-green-600">
              {user.is_active ? "সক্রিয় ✓" : "নিষ্ক্রিয়"}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="text-sm text-muted-foreground">যোগদান</span>
            <span className="text-sm">{new Date(user.created_at).toLocaleDateString("bn-BD")}</span>
          </div>
          {user.bio && (
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-sm text-muted-foreground">বায়ো</span>
              <p className="text-sm">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
