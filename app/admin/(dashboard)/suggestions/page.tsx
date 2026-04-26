"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getAllSuggestions, approveSuggestion, rejectSuggestion } from "@/lib/suggestions";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { CheckCircle, XCircle, MapPin, FileText, Store as StoreIcon } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUS_TABS = [
  { value: "", label: "সব" },
  { value: "pending", label: "অপেক্ষমাণ" },
  { value: "approved", label: "অনুমোদিত" },
  { value: "rejected", label: "প্রত্যাখ্যাত" },
];

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "oklch(0.78 0.16 55 / 0.15)", text: "var(--accent-amber)", label: "অপেক্ষমাণ" },
  approved: { bg: "oklch(0.70 0.14 160 / 0.15)", text: "var(--accent-jade)", label: "অনুমোদিত" },
  rejected: { bg: "oklch(0.60 0.22 35 / 0.15)", text: "var(--accent-ember)", label: "প্রত্যাখ্যাত" },
};

export default function AdminSuggestionsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["admin", "suggestions", statusFilter],
    queryFn: () => getAllSuggestions(statusFilter || undefined),
  });

  const approveMut = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => approveSuggestion(id, note),
    onSuccess: () => { toast("পরামর্শ অনুমোদিত এবং দোকান তৈরি হয়েছে", "success"); queryClient.invalidateQueries({ queryKey: ["admin"] }); },
    onError: () => toast("সমস্যা হয়েছে", "error"),
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => rejectSuggestion(id, note),
    onSuccess: () => { toast("পরামর্শ প্রত্যাখ্যাত হয়েছে", "error"); queryClient.invalidateQueries({ queryKey: ["admin"] }); },
    onError: () => toast("সমস্যা হয়েছে", "error"),
  });

  const pendingCount = suggestions?.filter((s) => s.status === "pending").length || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <AdminPageHeader title="পরামর্শসমূহ" count={pendingCount} countVariant="ember" />

      <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border-subtle)" }}>
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setStatusFilter(t.value)}
            className="relative px-4 py-2 text-xs font-medium transition-colors"
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
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !suggestions?.length ? (
        <p className="text-center py-16" style={{ color: "var(--text-tertiary)" }}>কোনো পরামর্শ পাওয়া যায়নি</p>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {suggestions.map((s) => {
            const ss = statusStyles[s.status] || statusStyles.pending;
            return (
              <motion.div
                key={s.id}
                variants={staggerItem}
                className="rounded-xl border overflow-hidden"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
              >
                {/* Suggester info */}
                <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    {s.user?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{s.user?.name || "অজানা"}</p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {s.user?.email} · {new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium" }).format(new Date(s.created_at))}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 py-4 space-y-2">
                  <p className="text-base sm:text-lg font-semibold font-heading flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <StoreIcon size={16} className="shrink-0" /> {s.name}
                  </p>
                  {s.address && (
                    <p className="text-sm flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                      <MapPin size={14} className="shrink-0" /> {s.address}
                    </p>
                  )}
                  {s.latitude && s.longitude && (
                    <p className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>{s.latitude}, {s.longitude}</p>
                  )}
                  {s.description && (
                    <p className="text-sm italic flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                      <FileText size={14} className="shrink-0" /> {s.description}
                    </p>
                  )}
                </div>

                {/* Status + actions */}
                <div className="px-5 pb-4 pt-2 border-t space-y-3" style={{ borderColor: "var(--border-subtle)" }}>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: ss.bg, color: ss.text }}>{ss.label}</span>

                  {s.status === "pending" ? (
                    <div className="space-y-3">
                      <textarea
                        value={adminNotes[s.id] || ""}
                        onChange={(e) => setAdminNotes((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        placeholder="অ্যাডমিন নোট (ঐচ্ছিক)..."
                        rows={2}
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                        style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                      />
                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium" style={{ background: "oklch(0.70 0.14 160 / 0.15)", color: "var(--accent-jade)" }}>
                              <CheckCircle size={14} /> অনুমোদন করুন
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-heavy border" style={{ borderColor: "var(--border-subtle)" }}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>অনুমোদন করবেন?</AlertDialogTitle>
                              <AlertDialogDescription>অনুমোদন করলে স্বয়ংক্রিয়ভাবে একটি নতুন দোকান তৈরি হবে। নিশ্চিত করুন?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => approveMut.mutate({ id: s.id, note: adminNotes[s.id] })}>অনুমোদন</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium" style={{ background: "oklch(0.60 0.22 35 / 0.15)", color: "var(--accent-ember)" }}>
                              <XCircle size={14} /> প্রত্যাখ্যান করুন
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-heavy border" style={{ borderColor: "var(--border-subtle)" }}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>প্রত্যাখ্যান করবেন?</AlertDialogTitle>
                              <AlertDialogDescription>এই পরামর্শ প্রত্যাখ্যান করবেন?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => rejectMut.mutate({ id: s.id, note: adminNotes[s.id] })} className="bg-destructive text-destructive-foreground">প্রত্যাখ্যান</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ) : s.admin_note ? (
                    <p className="text-sm italic" style={{ color: "var(--text-tertiary)" }}>অ্যাডমিন নোট: {s.admin_note}</p>
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
