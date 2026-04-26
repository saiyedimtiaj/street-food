"use client";

import { motion } from "framer-motion";

export function AdminLoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center" style={{ background: "var(--bg-base, oklch(0.11 0.012 60))" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-[var(--border-subtle,oklch(0.22_0.015_55))] border-t-[var(--accent-amber,oklch(0.78_0.16_55))]"
        />
        <p className="text-[var(--text-tertiary,oklch(0.50_0.03_60))] text-sm">লোড হচ্ছে...</p>
      </motion.div>
    </div>
  );
}
