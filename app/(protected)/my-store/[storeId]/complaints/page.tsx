"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, User2, Calendar } from "lucide-react";
import { getComplaintsByStore } from "@/lib/complaints";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem } from "@/lib/animations";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-500/10", text: "text-amber-600", label: "পেন্ডিং" },
  resolved: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "সমাধান হয়েছে" },
  dismissed: { bg: "bg-muted", text: "text-muted-foreground", label: "বাতিল" },
};

export default function StoreComplaintsPage() {
  const { storeId } = useParams<{ storeId: string }>();

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["store-complaints", storeId],
    queryFn: () => getComplaintsByStore(storeId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 py-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!complaints?.length) {
    return (
      <div className="py-20 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <AlertTriangle size={24} className="text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">আপনার দোকানের বিরুদ্ধে কোনো অভিযোগ নেই</p>
      </div>
    );
  }

  const pendingCount = complaints.filter((c) => c.status === "pending").length;

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold font-heading">অভিযোগসমূহ</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            মোট {complaints.length}টি
            {pendingCount > 0 && ` · ${pendingCount}টি পেন্ডিং`}
          </p>
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
        {complaints.map((complaint) => {
          const ss = statusStyles[complaint.status] || statusStyles.pending;
          return (
            <motion.div
              key={complaint.id}
              variants={staggerItem}
              className="rounded-2xl border border-border/60 bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {complaint.user?.name?.charAt(0).toUpperCase() || <User2 size={14} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none">{complaint.user?.name || "অজানা ব্যবহারকারী"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{complaint.user?.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ss.bg} ${ss.text}`}>
                    {ss.label}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(complaint.created_at).toLocaleDateString("bn-BD")}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4 space-y-3">
                <p className="text-sm font-semibold">{complaint.subject}</p>
                <div
                  className="prose prose-sm max-w-none text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: complaint.description }}
                />
                {complaint.admin_note && (
                  <div className="border-l-2 border-primary/30 pl-4 bg-muted/30 py-2.5 pr-3 rounded-r-lg">
                    <p className="text-xs font-semibold text-primary mb-1">প্রশাসকের মন্তব্য</p>
                    <p className="text-sm text-muted-foreground">{complaint.admin_note}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
