"use client";

import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { RefreshCw, ChevronRight } from "lucide-react";
import type { User } from "@/lib/types";

const pageTitles: Record<string, string> = {
  "/admin": "ড্যাশবোর্ড",
  "/admin/users": "ব্যবহারকারী",
  "/admin/stores": "দোকানসমূহ",
  "/admin/reviews": "রিভিউসমূহ",
  "/admin/suggestions": "পরামর্শসমূহ",
  "/admin/claims": "দাবিসমূহ",
  "/admin/settings": "সেটিংস",
};

export function AdminTopbar({ user }: { user: User }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const pageTitle = pageTitles[pathname] || (pathname.includes("/stores/") ? "দোকান বিস্তারিত" : "অ্যাডমিন");

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["admin"] });
  }

  return (
    <div
      className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6 shrink-0 border-b"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
    >
      {/* Left: breadcrumb — add left padding on mobile for hamburger */}
      <div className="flex items-center gap-2 text-sm min-w-0 pl-12 lg:pl-0">
        <span style={{ color: "var(--text-tertiary)" }}>Admin</span>
        <ChevronRight size={14} style={{ color: "var(--text-tertiary)" }} />
        <span className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{pageTitle}</span>
      </div>

      {/* Right: refresh + user */}
      <div className="flex items-center gap-3 shrink-0">
        <motion.button
          onClick={handleRefresh}
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-elevated)]"
          style={{ color: "var(--text-secondary)" }}
          title="রিফ্রেশ"
        >
          <RefreshCw size={16} />
        </motion.button>

        <div className="flex items-center gap-2">
          {user.profile_photo ? (
            <img src={user.profile_photo} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "var(--accent-amber)", color: "var(--bg-base)" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden text-sm font-medium md:block" style={{ color: "var(--text-primary)" }}>
            {user.name}
          </span>
        </div>
      </div>
    </div>
  );
}
