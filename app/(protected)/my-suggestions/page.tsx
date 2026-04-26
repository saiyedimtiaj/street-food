"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMySuggestions } from "@/lib/suggestions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/animations";
import type { Suggestion } from "@/lib/types";

export default function MySuggestionsPage() {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["my-suggestions"],
    queryFn: getMySuggestions,
  });

  const statusLabel = (s: string) =>
    s === "pending" ? "পেন্ডিং" : s === "approved" ? "অনুমোদিত" : "প্রত্যাখ্যাত";

  const statusColor = (s: string) =>
    s === "pending" ? "bg-yellow-500/10 text-yellow-600"
      : s === "approved" ? "bg-green-500/10 text-green-600"
      : "bg-red-500/10 text-red-600";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">আমার সাজেশন 📋</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">আপনার দেওয়া দোকান সাজেশনের তালিকা</p>
        </div>
        <Link href="/suggest">
          <Button size="sm">+ নতুন সাজেশন</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {suggestions && suggestions.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="text-5xl">💡</span>
          <h2 className="mt-4 text-lg font-semibold">কোনো সাজেশন নেই</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            আপনি এখনো কোনো দোকান সাজেস্ট করেননি
          </p>
          <Link href="/suggest" className="mt-4">
            <Button size="sm">দোকান সাজেস্ট করুন</Button>
          </Link>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="mt-6 space-y-3">
          {suggestions.map((s: Suggestion) => (
            <div key={s.id} className="rounded-xl border border-border/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  {s.description && <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>}
                  {s.address && <p className="mt-1 text-xs text-muted-foreground">📍 {s.address}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("bn-BD")}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(s.status)}`}>
                  {statusLabel(s.status)}
                </span>
              </div>
              {s.admin_note && (
                <div className="mt-3 rounded-lg border border-border/40 p-3">
                  <p className="text-xs text-muted-foreground">অ্যাডমিন নোট: {s.admin_note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
