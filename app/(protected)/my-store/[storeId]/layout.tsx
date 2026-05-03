"use client";

import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LayoutDashboard, UtensilsCrossed, Image as ImageIcon, MessageSquare, ChevronLeft, AlertTriangle } from "lucide-react";
import { getStoreById } from "@/lib/stores";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

const TABS = [
  { label: "ওভারভিউ", segment: "", icon: LayoutDashboard },
  { label: "মেনু", segment: "/menu", icon: UtensilsCrossed },
  { label: "গ্যালারি", segment: "/gallery", icon: ImageIcon },
  { label: "রিভিউ", segment: "/reviews", icon: MessageSquare },
  { label: "অভিযোগ", segment: "/complaints", icon: AlertTriangle },
];

export default function StoreIdLayout({ children }: { children: React.ReactNode }) {
  const { storeId } = useParams<{ storeId: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
  });

  useEffect(() => {
    if (!isLoading && store && store.owner_id !== user?.id) {
      router.replace("/my-store");
    }
  }, [isLoading, store, user, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <p className="text-muted-foreground">দোকান পাওয়া যায়নি</p>
      </div>
    );
  }

  const basePath = `/my-store/${storeId}`;

  function isActive(segment: string) {
    const full = basePath + segment;
    if (segment === "") return pathname === basePath;
    return pathname.startsWith(full);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 border-b border-border/40">
        <Link href="/my-store" className="shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ChevronLeft size={14} /> আমার দোকানসমূহ
        </Link>
        <div className="mx-2 h-5 w-px bg-border/40" />
        {TABS.map((tab) => {
          const active = isActive(tab.segment);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.segment}
              href={basePath + tab.segment}
              className={`relative shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {tab.label}
              {active && (
                <motion.div
                  layoutId="store-tab-indicator"
                  className="absolute inset-x-3 -bottom-4 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Store name breadcrumb */}
      <p className="mt-3 mb-6 text-xs text-muted-foreground">{store.name}</p>

      {children}
    </div>
  );
}
