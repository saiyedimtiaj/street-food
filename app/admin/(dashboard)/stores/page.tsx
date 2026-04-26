"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllStores, deleteStore } from "@/lib/stores";
import { suspendStore, activateStore } from "@/lib/admin";
import { getStoreImage } from "@/lib/images";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Pause, Play, Trash2, Star } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUS_TABS = [
  { value: "", label: "সব" },
  { value: "active", label: "সক্রিয়" },
  { value: "inactive", label: "নিষ্ক্রিয়" },
  { value: "suspended", label: "স্থগিত" },
];

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "oklch(0.70 0.14 160 / 0.15)", text: "var(--accent-jade)", label: "সক্রিয়" },
  inactive: { bg: "var(--bg-elevated)", text: "var(--text-tertiary)", label: "নিষ্ক্রিয়" },
  suspended: { bg: "oklch(0.60 0.22 35 / 0.15)", text: "var(--accent-ember)", label: "স্থগিত" },
};

export default function AdminStoresPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stores", page, status],
    queryFn: () => getAllStores({ page, limit: 15, status: status || undefined }),
  });

  const suspendMut = useMutation({
    mutationFn: suspendStore,
    onSuccess: () => { toast("দোকান স্থগিত হয়েছে", "success"); queryClient.invalidateQueries({ queryKey: ["admin", "stores"] }); },
  });
  const activateMut = useMutation({
    mutationFn: activateStore,
    onSuccess: () => { toast("দোকান সক্রিয় হয়েছে", "success"); queryClient.invalidateQueries({ queryKey: ["admin", "stores"] }); },
  });
  const deleteMut = useMutation({
    mutationFn: deleteStore,
    onSuccess: () => { toast("দোকান মুছে ফেলা হয়েছে", "success"); queryClient.invalidateQueries({ queryKey: ["admin", "stores"] }); },
  });

  const stores = data?.data || [];
  const filtered = search ? stores.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())) : stores;

  const columns = [
    { key: "cover", label: "", width: "60px" },
    { key: "name", label: "দোকান" },
    { key: "location", label: "অবস্থান", hiddenOnMobile: true },
    { key: "status", label: "স্ট্যাটাস", width: "100px" },
    { key: "rating", label: "রেটিং", width: "80px", hiddenOnMobile: true },
    { key: "actions", label: "অ্যাকশন", width: "160px" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <AdminPageHeader title="দোকানসমূহ" count={data?.total} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border-subtle)" }}>
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => { setStatus(t.value); setPage(1); }}
              className="px-2.5 sm:px-3 py-2 text-xs font-medium transition-colors"
              style={{
                background: status === t.value ? "var(--accent-amber)" : "var(--bg-surface)",
                color: status === t.value ? "var(--bg-base)" : "var(--text-secondary)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="খুঁজুন..."
            className="h-9 rounded-lg border pl-8 pr-3 text-sm outline-none"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
          />
        </div>
      </div>

      <AdminDataTable columns={columns} isLoading={isLoading} isEmpty={filtered.length === 0} emptyMessage="কোনো দোকান পাওয়া যায়নি">
        {filtered.map((store) => {
          const ss = statusStyles[store.status] || statusStyles.inactive;
          return (
            <tr key={store.id} className="border-t transition-colors hover:bg-[var(--bg-elevated)]/50" style={{ borderColor: "var(--border-subtle)" }}>
              <td className="px-4 py-3">
                <img src={getStoreImage(store.cover_image, store.category)} alt="" className="h-10 w-12 rounded-lg object-cover" />
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{store.name}</p>
                {store.category && <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{store.category}</p>}
              </td>
              <td className="px-4 py-3 text-sm max-w-[200px] truncate hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>
                {store.address || "—"}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: ss.bg, color: ss.text }}>{ss.label}</span>
              </td>
              <td className="px-4 py-3 text-sm hidden md:table-cell">
                <span className="flex items-center gap-1" style={{ color: "var(--accent-amber)" }}>
                  <Star size={14} fill="currentColor" /> {store.averageRating?.toFixed(1) || "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Link href={`/admin/stores/${store.id}`} title="বিস্তারিত" className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-elevated)]" style={{ color: "var(--text-secondary)" }}>
                    <Eye size={16} />
                  </Link>
                  {store.status !== "suspended" && (
                    <button onClick={() => suspendMut.mutate(store.id)} title="স্থগিত করুন" className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-elevated)]" style={{ color: "var(--accent-amber)" }}>
                      <Pause size={16} />
                    </button>
                  )}
                  {store.status !== "active" && (
                    <button onClick={() => activateMut.mutate(store.id)} title="সক্রিয় করুন" className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-elevated)]" style={{ color: "var(--accent-jade)" }}>
                      <Play size={16} />
                    </button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button title="মুছুন" className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-elevated)]" style={{ color: "var(--accent-ember)" }}>
                        <Trash2 size={16} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-heavy border" style={{ borderColor: "var(--border-subtle)" }}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>দোকান মুছতে চান?</AlertDialogTitle>
                        <AlertDialogDescription>এই দোকান এবং সমস্ত সংশ্লিষ্ট ডেটা মুছে যাবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>বাতিল</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMut.mutate(store.id)} className="bg-destructive text-destructive-foreground">মুছুন</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          );
        })}
      </AdminDataTable>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-30" style={{ color: "var(--text-secondary)" }}>পূর্ববর্তী</button>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: p === page ? "var(--accent-amber)" : "transparent", color: p === page ? "var(--bg-base)" : "var(--text-secondary)" }}>
              {p.toLocaleString("bn-BD")}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(data.totalPages, page + 1))} disabled={page === data.totalPages} className="rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-30" style={{ color: "var(--text-secondary)" }}>পরবর্তী</button>
        </div>
      )}
    </div>
  );
}
