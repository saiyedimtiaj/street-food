"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  countVariant?: "amber" | "ember" | "jade";
  action?: React.ReactNode;
}

const variantColors: Record<string, string> = {
  amber: "bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]",
  ember: "bg-[var(--accent-ember)]/15 text-[var(--accent-ember)]",
  jade: "bg-[var(--accent-jade)]/15 text-[var(--accent-jade)]",
};

export function AdminPageHeader({ title, subtitle, count, countVariant = "amber", action }: AdminPageHeaderProps) {
  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight font-heading" style={{ color: "var(--text-primary)" }}>
            {title}
          </h1>
          {count !== undefined && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantColors[countVariant]}`}>
              {count.toLocaleString("bn-BD")}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
