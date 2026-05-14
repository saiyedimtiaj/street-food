"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
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

export function Navbar() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (!user) return null;

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  const navLinks = getNavLinks(user.role);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🍜</span>
            <span className="text-lg font-bold tracking-tight">স্ট্রিট ফুড</span>
          </Link>
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === link.href
                    ? "font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute inset-x-3 -bottom-4.25 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="hidden items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted/50 sm:flex"
          >
            {user.profile_photo ? (
              <img src={user.profile_photo} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium">{user.name}</span>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                লগআউট
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>আপনি কি লগআউট করতে চান?</AlertDialogTitle>
                <AlertDialogDescription>
                  লগআউট করলে আপনাকে আবার লগইন করতে হবে। আপনি কি নিশ্চিত?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">না, থাকুক</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {loggingOut ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      লগআউট হচ্ছে...
                    </span>
                  ) : (
                    "হ্যাঁ, লগআউট করুন"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/40 px-4 pb-4 pt-2 lg:hidden">
          <div className="flex items-center gap-3 border-b border-border/40 pb-3 mb-2 sm:hidden">
            <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              {user.profile_photo ? (
                <img src={user.profile_photo} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium">{user.name}</span>
            </Link>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                pathname === link.href
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-border/40 pt-3 sm:hidden">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  লগআউট
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>আপনি কি লগআউট করতে চান?</AlertDialogTitle>
                  <AlertDialogDescription>
                    লগআউট করলে আপনাকে আবার লগইন করতে হবে।
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">না, থাকুক</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {loggingOut ? "লগআউট হচ্ছে..." : "হ্যাঁ, লগআউট করুন"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </nav>
      )}
    </header>
  );
}

function getNavLinks(role: string) {
  const common = [{ href: "/stores", label: "দোকান" }];

  if (role === "user") {
    return [
      ...common,
      { href: "/search", label: "খুঁজুন" },
      { href: "/reviews", label: "রিভিউ" },
      { href: "/my-reviews", label: "আমার রিভিউ" },
      { href: "/suggest", label: "সাজেস্ট" },
    ];
  }

  if (role === "store") {
    return [
      ...common,
      { href: "/my-store", label: "আমার দোকান" },
      { href: "/my-store/menu", label: "মেনু" },
      { href: "/my-store/reviews", label: "রিভিউ" },
      { href: "/claim", label: "দাবি করুন" },
    ];
  }

  if (role === "admin") {
    return [
      ...common,
      { href: "/admin", label: "ড্যাশবোর্ড" },
      { href: "/admin/users", label: "ব্যবহারকারী" },
      { href: "/admin/stores", label: "দোকান ব্যবস্থাপনা" },
      { href: "/admin/suggestions", label: "সাজেশন" },
      { href: "/admin/claims", label: "দাবি" },
    ];
  }

  return common;
}
