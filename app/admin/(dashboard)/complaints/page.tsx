"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, User2, Store as StoreIcon, Calendar } from "lucide-react";
import { getAllComplaints, resolveComplaint, dismissComplaint } from "@/lib/complaints";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { staggerContainer, staggerItem } from "@/lib/animations";

const STATUS_TABS = [
  { value: "", label: "সব" },
  { value: "pending", label: "পেন্ডিং" },
  { value: "resolved", label: "সমাধান" },
  { value: "dismissed", label: "বাতিল" },
];

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "oklch(0.78 0.16 55 / 0.15)", text: "var(--accent-amber)", label: "পেন্ডিং" },
  resolved: { bg: "oklch(0.70 0.14 160 / 0.15)", text: "var(--accent-jade)", label: "সমাধান হয়েছে" },
  dismissed: { bg: "oklch(0.50 0 0 / 0.1)", text: "var(--text-secondary)", label: "বাতিল" },
};

export default function AdminComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["admin", "complaints", statusFilter],
    queryFn: () => getAllComplaints(statusFilter || undefined),
  });

  const resolveMut = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => resolveComplaint(id, note),
    onSuccess: () => { toast("অভিযোগ সমাধান করা হয়েছে", "success"); queryClient.invalidateQueries({ queryKey: ["admin", "complaints"] }); },
    onError: () => toast("সমস্যা হয়েছে", "error"),
  });

  const dismissMut = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => dismissComplaint(id, note),
    onSuccess: () => { toast("অভিযোগ বাতিল করা হয়েছে", "error"); queryClient.invalidateQueries({ queryKey: ["admin", "complaints"] }); },
    onError: () => toast("সমস্যা হয়েছে", "error"),
  });

  const pendingCount = complaints?.filter((c) => c.status === "pending").length || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <AdminPageHeader title="অভিযোগসমূহ" count={pendingCount} countVariant="ember" />

      {/* Filter tabs */}
      <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border-subtle)" }}>
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setStatusFilter(t.value)}
            className="px-4 py-2 text-xs font-medium transition-colors"
            style={{
              background: statusFilter === t.value ? "var(--accent-amber)" : "var(--bg-surface)",
              color: statusFilter === t.value ? "var(--bg-base)" : "var(--text-secondary)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : !complaints?.length ? (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--bg-elevated)" }}>
            <AlertTriangle size={24} style={{ color: "var(--text-tertiary)" }} />
          </div>
          <p className="mt-3 text-sm" style={{ color: "var(--text-tertiary)" }}>কোনো অভিযোগ পাওয়া যায়নি</p>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {complaints.map((c) => {
            const ss = statusStyles[c.status] || statusStyles.pending;
            return (
              <motion.div
                key={c.id}
                variants={staggerItem}
                className="rounded-xl border overflow-hidden"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 px-5 pt-4 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    {c.user?.name?.charAt(0).toUpperCase() || <User2 size={14} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.user?.name || "অজানা"}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                      {c.user?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: ss.bg, color: ss.text }}>
                      {ss.label}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                      <Calendar size={11} />
                      {new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium" }).format(new Date(c.created_at))}
                    </span>
                  </div>
                </div>

                {/* Store + content */}
                <div className="px-5 py-4 space-y-3">
                  <p className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <StoreIcon size={14} className="shrink-0" style={{ color: "var(--text-tertiary)" }} />
                    {c.store?.name || "অজানা দোকান"}
                    {c.store?.address && (
                      <span className="text-xs font-normal" style={{ color: "var(--text-tertiary)" }}>
                        · {c.store.address}
                      </span>
                    )}
                  </p>
                  <p className="text-base font-semibold font-heading" style={{ color: "var(--text-primary)" }}>{c.subject}</p>
                  <div
                    className="prose prose-sm max-w-none text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                    dangerouslySetInnerHTML={{ __html: c.description }}
                  />
                </div>

                {/* Actions */}
                <div className="px-5 pb-4 pt-2 border-t space-y-3" style={{ borderColor: "var(--border-subtle)" }}>
                  {c.status === "pending" ? (
                    <div className="space-y-3">
                      <textarea
                        value={adminNotes[c.id] || ""}
                        onChange={(e) => setAdminNotes((prev) => ({ ...prev, [c.id]: e.target.value }))}
                        placeholder="অ্যাডমিন নোট (ঐচ্ছিক)..."
                        rows={2}
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
                        style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                      />
                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium"
                              style={{ background: "oklch(0.70 0.14 160 / 0.15)", color: "var(--accent-jade)" }}
                            >
                              <CheckCircle size={14} /> সমাধান করুন
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-heavy border" style={{ borderColor: "var(--border-subtle)" }}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>অভিযোগ সমাধান করবেন?</AlertDialogTitle>
                              <AlertDialogDescription>অভিযোগটি সমাধান হয়েছে বলে চিহ্নিত হবে।</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => resolveMut.mutate({ id: c.id, note: adminNotes[c.id] })}>সমাধান</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium"
                              style={{ background: "oklch(0.60 0.22 35 / 0.15)", color: "var(--accent-ember)" }}
                            >
                              <XCircle size={14} /> বাতিল করুন
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-heavy border" style={{ borderColor: "var(--border-subtle)" }}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>অভিযোগ বাতিল করবেন?</AlertDialogTitle>
                              <AlertDialogDescription>অভিযোগটি বাতিল হিসেবে চিহ্নিত হবে।</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>না</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => dismissMut.mutate({ id: c.id, note: adminNotes[c.id] })}
                                className="bg-destructive text-destructive-foreground"
                              >
                                বাতিল করুন
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ) : c.admin_note ? (
                    <p className="text-sm italic" style={{ color: "var(--text-tertiary)" }}>অ্যাডমিন নোট: {c.admin_note}</p>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
