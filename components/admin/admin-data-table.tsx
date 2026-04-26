"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Column {
  key: string;
  label: string;
  width?: string;
  hiddenOnMobile?: boolean;
}

interface AdminDataTableProps {
  columns: Column[];
  isLoading: boolean;
  isEmpty: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
  children: React.ReactNode;
}

export function AdminDataTable({
  columns,
  isLoading,
  isEmpty,
  skeletonRows = 8,
  emptyMessage = "কোনো ডেটা পাওয়া যায়নি",
  children,
}: AdminDataTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--bg-elevated)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest ${col.hiddenOnMobile ? "hidden md:table-cell" : ""}`}
                style={{ color: "var(--text-tertiary)", width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.hiddenOnMobile ? "hidden md:table-cell" : ""}`}>
                    <Skeleton className="h-5 w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : isEmpty ? (
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center" style={{ color: "var(--text-tertiary)" }}>
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        ) : (
          <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
            {children}
          </motion.tbody>
        )}
      </table>
    </div>
  );
}

export function TableRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.tr
      variants={staggerItem}
      className={`border-t transition-colors hover:bg-[var(--bg-elevated)]/50 ${className}`}
      style={{ borderColor: "var(--border-subtle)" }}
    >
      {children}
    </motion.tr>
  );
}
