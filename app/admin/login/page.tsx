"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { login } from "@/lib/auth";
import { useToast } from "@/components/ui/toast";
import { modalEnter } from "@/lib/animations";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: () => login({ email, password }),
    onSuccess: () => {
      router.push("/admin");
    },
    onError: () => {
      toast("ভুল ইমেইল বা পাসওয়ার্ড", "error");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "var(--bg-base)",
        backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <motion.div
        variants={modalEnter}
        initial="hidden"
        animate="visible"
        className="glass-heavy rounded-2xl p-8 w-full max-w-sm border"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-2xl mb-4"
            style={{ background: "oklch(0.78 0.16 55 / 0.15)" }}
          >
            🔐
          </div>
          <h1 className="text-xl font-bold font-heading" style={{ color: "var(--text-primary)" }}>
            অ্যাডমিন প্যানেল
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
            শুধুমাত্র অ্যাডমিনদের জন্য
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 rounded-lg border px-3 text-sm outline-none transition-colors focus:border-[var(--accent-amber)]"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
              }}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 rounded-lg border px-3 pr-10 text-sm outline-none transition-colors focus:border-[var(--accent-amber)]"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-10 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, var(--accent-amber), oklch(0.70 0.18 45))",
              color: "var(--bg-base)",
            }}
          >
            {mutation.isPending ? "প্রবেশ হচ্ছে..." : "প্রবেশ করুন"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
