"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/admin";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, Users, Store, MessageSquare, Lightbulb, Bookmark,
  Settings, ExternalLink, LogOut, ChevronLeft, ChevronRight, X, Menu, Flame,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  external?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
    refetchInterval: 30_000,
  });

  const navGroups: NavGroup[] = [
    {
      title: "ওভারভিউ",
      items: [
        { icon: <LayoutDashboard size={18} />, label: "ড্যাশবোর্ড", href: "/admin" },
      ],
    },
    {
      title: "ব্যবস্থাপনা",
      items: [
        { icon: <Users size={18} />, label: "ব্যবহারকারী", href: "/admin/users" },
        { icon: <Store size={18} />, label: "দোকানসমূহ", href: "/admin/stores" },
        { icon: <MessageSquare size={18} />, label: "রিভিউসমূহ", href: "/admin/reviews" },
      ],
    },
    {
      title: "মডারেশন",
      items: [
        { icon: <Lightbulb size={18} />, label: "পরামর্শ", href: "/admin/suggestions", badge: stats?.pendingSuggestions },
        { icon: <Bookmark size={18} />, label: "দাবি", href: "/admin/claims", badge: stats?.pendingClaims },
      ],
    },
    {
      title: "সিস্টেম",
      items: [
        { icon: <Settings size={18} />, label: "সেটিংস", href: "/admin/settings" },
        { icon: <ExternalLink size={18} />, label: "মূল সাইট", href: "/", external: true },
      ],
    },
  ];

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-[72px] items-center gap-3 px-4 shrink-0">
        <Flame size={24} className="shrink-0 text-amber-400" />
        <AnimatePresence>
          {(open || mobileOpen) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-heading font-semibold text-sm whitespace-nowrap overflow-hidden bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
            >
              অ্যাডমিন প্যানেল
            </motion.span>
          )}
        </AnimatePresence>
        {/* Mobile close */}
        <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden" style={{ color: "var(--text-secondary)" }}>
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <AnimatePresence>
              {(open || mobileOpen) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {group.title}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    title={!open && !mobileOpen ? item.label : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 relative ${
                      active ? "font-semibold" : "hover:bg-[var(--bg-elevated)]"
                    }`}
                    style={{
                      color: active ? "var(--accent-amber)" : "var(--text-secondary)",
                      background: active ? "var(--bg-elevated)" : undefined,
                    }}
                  >
                    {active && (
                      <motion.div
                        layoutId="admin-sidebar-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                        style={{ background: "var(--accent-amber)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="shrink-0 w-5 flex items-center justify-center">{item.icon}</span>
                    <AnimatePresence>
                      {(open || mobileOpen) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden flex-1"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {(open || mobileOpen) && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className="ml-auto shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                        style={{ background: "var(--accent-ember)", animation: "ember-pulse 2s ease-in-out infinite" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: logout + collapse toggle */}
      <div className="shrink-0 border-t px-2 py-3 space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
        <button
          onClick={handleLogout}
          title={!open && !mobileOpen ? "লগআউট" : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[var(--bg-elevated)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {(open || mobileOpen) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                লগআউট
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="hidden lg:flex w-full items-center justify-center rounded-lg py-2 text-sm transition-colors hover:bg-[var(--bg-elevated)]"
          style={{ color: "var(--text-tertiary)" }}
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
        style={{ background: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col lg:hidden"
            style={{ background: "oklch(0.10 0.010 60)", borderRight: "1px solid var(--border-subtle)" }}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: open ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative hidden lg:flex flex-col h-full shrink-0 overflow-hidden"
        style={{ background: "oklch(0.10 0.010 60)", borderRight: "1px solid var(--border-subtle)" }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
