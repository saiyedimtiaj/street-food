"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: "amber" | "jade" | "ember" | "sky";
  isLoading?: boolean;
  glowIfPositive?: boolean;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  amber: { bg: "oklch(0.78 0.16 55 / 0.15)", text: "var(--accent-amber)" },
  jade: { bg: "oklch(0.70 0.14 160 / 0.15)", text: "var(--accent-jade)" },
  ember: { bg: "oklch(0.60 0.22 35 / 0.15)", text: "var(--accent-ember)" },
  sky: { bg: "oklch(0.70 0.14 230 / 0.15)", text: "var(--accent-sky)" },
};

function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export function AdminStatCard({ label, value, icon, accentColor, isLoading, glowIfPositive }: AdminStatCardProps) {
  const displayValue = useCountUp(isLoading ? 0 : value);
  const colors = colorMap[accentColor];
  const shouldGlow = glowIfPositive && value > 0 && !isLoading;

  if (isLoading) {
    return (
      <div className="rounded-xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <Skeleton className="mt-4 h-8 w-20" />
        <Skeleton className="mt-2 h-4 w-28" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-5 transition-colors"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        animation: shouldGlow ? "ember-pulse 2s ease-in-out infinite" : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-lg" style={{ background: colors.bg }}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold font-heading" style={{ color: colors.text }}>
          {displayValue.toLocaleString("bn-BD")}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
      </div>
    </motion.div>
  );
}
