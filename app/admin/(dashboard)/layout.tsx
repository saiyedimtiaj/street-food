"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminLoadingScreen } from "@/components/admin/admin-loading-screen";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: getMe,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <AdminLoadingScreen />;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar user={user} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
