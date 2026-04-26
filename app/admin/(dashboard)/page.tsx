"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getAdminStats } from "@/lib/admin";
import { getAllSuggestions } from "@/lib/suggestions";
import { getAllClaims } from "@/lib/claims";
import { getAllStores } from "@/lib/stores";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  Users, Store as StoreIcon, MessageSquare, CheckCircle, Lightbulb, Bookmark,
  Star, Activity, AlertTriangle, TrendingUp,
} from "lucide-react";
import type { Store } from "@/lib/types";

function useBanglaDate() {
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    function update() {
      setDateStr(
        new Intl.DateTimeFormat("bn-BD", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    }
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return dateStr;
}

export default function AdminDashboardPage() {
  const dateStr = useBanglaDate();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
  });

  const { data: suggestions } = useQuery({
    queryKey: ["admin", "suggestions", "pending"],
    queryFn: () => getAllSuggestions("pending"),
  });

  const { data: claims } = useQuery({
    queryKey: ["admin", "claims", "pending"],
    queryFn: () => getAllClaims("pending"),
  });

  const { data: storesData } = useQuery({
    queryKey: ["admin", "top-stores"],
    queryFn: () => getAllStores({ page: 1, limit: 5 }),
  });

  const topStores = storesData?.data?.slice().sort((a: Store, b: Store) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 5) || [];
  const healthPercent = stats ? Math.round((stats.activeStores / Math.max(stats.totalStores, 1)) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <AdminPageHeader
        title="ড্যাশবোর্ড"
        subtitle={dateStr}
      />

      {/* Stat cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div variants={staggerItem}>
          <AdminStatCard label="মোট ব্যবহারকারী" value={stats?.totalUsers || 0} icon={<Users size={20} />} accentColor="sky" isLoading={statsLoading} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <AdminStatCard label="মোট দোকান" value={stats?.totalStores || 0} icon={<StoreIcon size={20} />} accentColor="amber" isLoading={statsLoading} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <AdminStatCard label="মোট রিভিউ" value={stats?.totalReviews || 0} icon={<MessageSquare size={20} />} accentColor="jade" isLoading={statsLoading} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <AdminStatCard label="সক্রিয় দোকান" value={stats?.activeStores || 0} icon={<CheckCircle size={20} />} accentColor="jade" isLoading={statsLoading} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <AdminStatCard label="পেন্ডিং পরামর্শ" value={stats?.pendingSuggestions || 0} icon={<Lightbulb size={20} />} accentColor="ember" isLoading={statsLoading} glowIfPositive />
        </motion.div>
        <motion.div variants={staggerItem}>
          <AdminStatCard label="পেন্ডিং দাবি" value={stats?.pendingClaims || 0} icon={<Bookmark size={20} />} accentColor="ember" isLoading={statsLoading} glowIfPositive />
        </motion.div>
      </motion.div>

      {/* Two column row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 rounded-xl border p-4 sm:p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} style={{ color: "var(--text-primary)" }} />
            <h2 className="text-sm sm:text-base font-semibold font-heading" style={{ color: "var(--text-primary)" }}>
              সাম্প্রতিক কার্যক্রম
            </h2>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--accent-jade)" }}>
              <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
              লাইভ
            </span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {suggestions?.slice(0, 4).map((s) => (
              <Link key={s.id} href="/admin/suggestions" className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--bg-elevated)]">
                <Lightbulb size={14} className="shrink-0" style={{ color: "var(--accent-amber)" }} />
                <span className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                  নতুন পরামর্শ: {s.name}
                </span>
                <span className="ml-auto text-xs shrink-0 hidden sm:block" style={{ color: "var(--text-tertiary)" }}>
                  {new Intl.DateTimeFormat("bn-BD", { dateStyle: "short" }).format(new Date(s.created_at))}
                </span>
              </Link>
            ))}
            {claims?.slice(0, 4).map((c) => (
              <Link key={c.id} href="/admin/claims" className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--bg-elevated)]">
                <Bookmark size={14} className="shrink-0" style={{ color: "var(--accent-ember)" }} />
                <span className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                  নতুন দাবি: {c.store?.name || "অজানা"}
                </span>
                <span className="ml-auto text-xs shrink-0 hidden sm:block" style={{ color: "var(--text-tertiary)" }}>
                  {new Intl.DateTimeFormat("bn-BD", { dateStyle: "short" }).format(new Date(c.created_at))}
                </span>
              </Link>
            ))}
            {!suggestions?.length && !claims?.length && (
              <p className="text-sm py-4 text-center" style={{ color: "var(--text-tertiary)" }}>
                কোনো সাম্প্রতিক কার্যক্রম নেই
              </p>
            )}
          </div>
        </div>

        {/* Urgent Actions */}
        <div className="lg:col-span-2 rounded-xl border p-4 sm:p-5 space-y-4" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} style={{ color: "var(--text-primary)" }} />
            <h2 className="text-sm sm:text-base font-semibold font-heading" style={{ color: "var(--text-primary)" }}>
              জরুরি মনোযোগ
            </h2>
          </div>

          <div className="rounded-lg p-4" style={{ background: "var(--bg-elevated)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--accent-ember)" }}>
              {(stats?.pendingSuggestions || 0).toLocaleString("bn-BD")} টি পরামর্শ অপেক্ষমাণ
            </p>
            <Link href="/admin/suggestions">
              <button className="mt-2 rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "var(--accent-amber)", color: "var(--bg-base)" }}>
                এখনই রিভিউ করুন
              </button>
            </Link>
          </div>

          <div className="rounded-lg p-4" style={{ background: "var(--bg-elevated)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--accent-ember)" }}>
              {(stats?.pendingClaims || 0).toLocaleString("bn-BD")} টি দাবি অপেক্ষমাণ
            </p>
            <Link href="/admin/claims">
              <button className="mt-2 rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "var(--accent-amber)", color: "var(--bg-base)" }}>
                এখনই রিভিউ করুন
              </button>
            </Link>
          </div>

          <div className="rounded-lg p-4" style={{ background: "var(--bg-elevated)" }}>
            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>প্ল্যাটফর্ম হেলথ</p>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "var(--accent-jade)" }}
              />
            </div>
            <p className="mt-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
              {healthPercent.toLocaleString("bn-BD")}% দোকান সক্রিয়
            </p>
          </div>
        </div>
      </div>

      {/* Top stores table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center gap-2 px-4 sm:px-5 py-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <TrendingUp size={16} style={{ color: "var(--text-primary)" }} />
          <h2 className="text-sm sm:text-base font-semibold font-heading" style={{ color: "var(--text-primary)" }}>শীর্ষ রেটিং দোকান</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>দোকান</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest hidden sm:table-cell" style={{ color: "var(--text-tertiary)" }}>ক্যাটাগরি</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>রেটিং</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest hidden sm:table-cell" style={{ color: "var(--text-tertiary)" }}>স্ট্যাটাস</th>
              </tr>
          </thead>
          <tbody>
            {!storesData ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-6" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                </tr>
              ))
            ) : topStores.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center" style={{ color: "var(--text-tertiary)" }}>
                  কোনো দোকান নেই
                </td>
              </tr>
            ) : (
              topStores.map((store: Store, i: number) => (
                <tr key={store.id} className="border-t transition-colors hover:bg-[var(--bg-elevated)]/50" style={{ borderColor: "var(--border-subtle)" }}>
                  <td className="px-4 py-3" style={{ color: "var(--text-tertiary)" }}>{(i + 1).toLocaleString("bn-BD")}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{store.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell" style={{ color: "var(--text-secondary)" }}>{store.category || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1" style={{ color: "var(--accent-amber)" }}>
                      <Star size={14} fill="currentColor" /> {store.averageRating?.toFixed(1) || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <StatusPill status={store.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "oklch(0.70 0.14 160 / 0.15)", text: "var(--accent-jade)", label: "সক্রিয়" },
    inactive: { bg: "var(--bg-elevated)", text: "var(--text-tertiary)", label: "নিষ্ক্রিয়" },
    suspended: { bg: "oklch(0.60 0.22 35 / 0.15)", text: "var(--accent-ember)", label: "স্থগিত" },
  };
  const s = map[status] || map.inactive;
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}
