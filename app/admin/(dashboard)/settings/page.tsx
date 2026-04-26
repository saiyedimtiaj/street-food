"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminSettingsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <AdminPageHeader title="সেটিংস" subtitle="প্ল্যাটফর্ম সেটিংস (শীঘ্রই আসছে)" />

      <div
        className="rounded-xl border p-12 text-center"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
      >
        <p className="text-4xl mb-4">⚙️</p>
        <p className="text-lg font-heading font-semibold" style={{ color: "var(--text-primary)" }}>
          শীঘ্রই আসছে
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
          প্ল্যাটফর্ম কনফিগারেশন এখানে পরিচালনা করা যাবে
        </p>
      </div>
    </div>
  );
}
