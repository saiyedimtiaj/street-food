"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const categories = [
  { emoji: "🍢", name: "ফুচকা" },
  { emoji: "🥘", name: "বিরিয়ানি" },
  { emoji: "🍡", name: "চটপটি" },
  { emoji: "🥤", name: "লাচ্ছি" },
  { emoji: "🍛", name: "খিচুড়ি" },
  { emoji: "🧆", name: "শিঙ্গাড়া" },
  { emoji: "🍗", name: "ফ্রাইড চিকেন" },
  { emoji: "🍰", name: "মিষ্টি" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">খাবার খুঁজুন 🔍</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        আপনার পছন্দের স্ট্রিট ফুড খুঁজে দেখুন
      </p>

      <div className="mt-6">
        <Input
          placeholder="খাবারের নাম বা দোকান লিখুন..."
          className="h-12 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">ক্যাটাগরি</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-border/60 p-4 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {query && (
        <div className="mt-10 text-center">
          <p className="text-muted-foreground">
            &ldquo;{query}&rdquo; এর জন্য কোনো ফলাফল পাওয়া যায়নি
          </p>
          <p className="mt-1 text-sm text-muted-foreground">শীঘ্রই আসছে!</p>
        </div>
      )}
    </div>
  );
}
