"use client";

import { useAuth } from "@/context/auth-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">সেটিংস ⚙️</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        আপনার অ্যাকাউন্ট সেটিংস পরিবর্তন করুন
      </p>

      <div className="mt-8 space-y-8">
        {/* Profile section */}
        <div className="rounded-xl border border-border/60 p-6">
          <h2 className="text-sm font-semibold text-foreground">প্রোফাইল তথ্য</h2>
          <p className="mt-1 text-xs text-muted-foreground">আপনার নাম ও ইমেইল পরিবর্তন করুন</p>

          <div className="mt-5 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm">নাম</Label>
              <Input id="name" defaultValue={user.name} className="h-10" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm">ইমেইল</Label>
              <Input id="email" defaultValue={user.email} className="h-10" disabled />
              <p className="text-xs text-muted-foreground">ইমেইল পরিবর্তন করা যাবে না</p>
            </div>
            <Button size="sm">সংরক্ষণ করুন</Button>
          </div>
        </div>

        {/* Password section */}
        <div className="rounded-xl border border-border/60 p-6">
          <h2 className="text-sm font-semibold text-foreground">পাসওয়ার্ড</h2>
          <p className="mt-1 text-xs text-muted-foreground">আপনার পাসওয়ার্ড পরিবর্তন করুন</p>

          <div className="mt-5 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-pw" className="text-sm">বর্তমান পাসওয়ার্ড</Label>
              <Input id="current-pw" type="password" placeholder="••••••••" className="h-10" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-pw" className="text-sm">নতুন পাসওয়ার্ড</Label>
              <Input id="new-pw" type="password" placeholder="••••••••" className="h-10" />
            </div>
            <Button size="sm">পাসওয়ার্ড পরিবর্তন করুন</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
