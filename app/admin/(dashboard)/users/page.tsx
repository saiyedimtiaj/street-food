"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getAllUsers, deactivateUser } from "@/lib/users";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDataTable, TableRow } from "@/components/admin/admin-data-table";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Search, UserX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ROLES = [
  { value: "", label: "সব" },
  { value: "user", label: "ব্যবহারকারী" },
  { value: "store", label: "দোকান মালিক" },
  { value: "admin", label: "অ্যাডমিন" },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  user: { bg: "oklch(0.78 0.16 55 / 0.15)", text: "var(--accent-amber)" },
  store: { bg: "oklch(0.70 0.14 160 / 0.15)", text: "var(--accent-jade)" },
  admin: { bg: "oklch(0.60 0.22 35 / 0.15)", text: "var(--accent-ember)" },
};

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page, role],
    queryFn: () => getAllUsers({ page, limit: 15, role: role || undefined }),
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      toast("ব্যবহারকারী নিষ্ক্রিয় হয়েছে", "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => toast("সমস্যা হয়েছে", "error"),
  });

  const users = data?.data || [];
  const filtered = search ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : users;

  const columns = [
    { key: "#", label: "#", width: "50px" },
    { key: "name", label: "নাম" },
    { key: "email", label: "ইমেইল", hiddenOnMobile: true },
    { key: "role", label: "ভূমিকা", width: "120px" },
    { key: "status", label: "স্ট্যাটাস", width: "100px", hiddenOnMobile: true },
    { key: "joined", label: "যোগদান", width: "120px", hiddenOnMobile: true },
    { key: "actions", label: "অ্যাকশন", width: "120px" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <AdminPageHeader title="ব্যবহারকারী" count={data?.total} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border-subtle)" }}>
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => { setRole(r.value); setPage(1); }}
              className="relative px-2.5 sm:px-3 py-2 text-xs font-medium transition-colors"
              style={{
                background: role === r.value ? "var(--accent-amber)" : "var(--bg-surface)",
                color: role === r.value ? "var(--bg-base)" : "var(--text-secondary)",
              }}
            >
              {r.label}
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

      {/* Table */}
      <AdminDataTable columns={columns} isLoading={isLoading} isEmpty={filtered.length === 0} emptyMessage="কোনো ব্যবহারকারী পাওয়া যায়নি">
        {filtered.map((user, i) => {
          const rc = roleColors[user.role] || roleColors.user;
          return (
            <tr key={user.id} className="border-t transition-colors hover:bg-[var(--bg-elevated)]/50" style={{ borderColor: "var(--border-subtle)" }}>
              <td className="px-4 py-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                {((page - 1) * 15 + i + 1).toLocaleString("bn-BD")}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  {user.profile_photo ? (
                    <img src={user.profile_photo} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ background: rc.bg, color: rc.text }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{user.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>{user.email}</td>
              <td className="px-4 py-3">
                <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: rc.bg, color: rc.text }}>
                  {user.role === "user" ? "ব্যবহারকারী" : user.role === "store" ? "দোকান মালিক" : "অ্যাডমিন"}
                </span>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="flex items-center gap-1.5 text-xs">
                  <span className={`h-2 w-2 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-500"}`} />
                  <span style={{ color: "var(--text-secondary)" }}>{user.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}</span>
                </span>
              </td>
              <td className="px-4 py-3 text-xs hidden md:table-cell" style={{ color: "var(--text-tertiary)" }}>
                {new Intl.DateTimeFormat("bn-BD", { dateStyle: "short" }).format(new Date(user.created_at))}
              </td>
              <td className="px-4 py-3">
                {user.role !== "admin" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-elevated)]" style={{ color: "var(--accent-ember)" }}>
                        <UserX size={14} />
                        <span className="hidden sm:inline">নিষ্ক্রিয় করুন</span>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-heavy border" style={{ borderColor: "var(--border-subtle)" }}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                        <AlertDialogDescription>এই ব্যবহারকারীর অ্যাকাউন্ট নিষ্ক্রিয় হবে।</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>বাতিল</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deactivateMutation.mutate(user.id)} className="bg-destructive text-destructive-foreground">
                          নিষ্ক্রিয় করুন
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </td>
            </tr>
          );
        })}
      </AdminDataTable>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-30 transition-colors hover:bg-[var(--bg-elevated)]"
            style={{ color: "var(--text-secondary)" }}
          >
            পূর্ববর্তী
          </button>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: p === page ? "var(--accent-amber)" : "transparent",
                color: p === page ? "var(--bg-base)" : "var(--text-secondary)",
              }}
            >
              {p.toLocaleString("bn-BD")}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className="rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-30 transition-colors hover:bg-[var(--bg-elevated)]"
            style={{ color: "var(--text-secondary)" }}
          >
            পরবর্তী
          </button>
        </div>
      )}
    </div>
  );
}
