"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { login, type LoginPayload } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function LoginPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();

  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      refetchUser();
      router.push("/");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg =
        err.response?.data?.message || "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      setError(msg);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    mutation.mutate(form);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden border-r border-primary/10 p-12">
        {/* Glow background */}
        <div className="pointer-events-none absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="pointer-events-none absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-amber-500/5 blur-[100px]" />

        <div className="flex items-center gap-3">
          <span className="text-3xl">🍜</span>
          <span className="text-xl font-bold tracking-tight font-heading text-primary glow-text">স্ট্রিট ফুড</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={staggerItem} className="space-y-2">
            <h2 className="text-4xl font-bold leading-tight tracking-tight font-heading text-foreground">
              স্বাদে ভরা রাস্তা,<br />
              <span className="text-primary glow-text">গল্পে ভরা প্লেট।</span>
            </h2>
            <p className="max-w-md text-lg text-muted-foreground">
              বাংলাদেশের সেরা স্ট্রিট ফুড খুঁজুন, রিভিউ দিন এবং আপনার পছন্দের খাবার সবার সাথে শেয়ার করুন।
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="flex gap-4 text-4xl opacity-80">
            {["🍢", "🥘", "🧆", "🍡", "🥤"].map((emoji, i) => (
              <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>{emoji}</span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border border-primary/10 glass p-5"
        >
          <p className="text-sm italic text-muted-foreground">
            &ldquo;এই অ্যাপ দিয়ে আমি আমার এলাকার সেরা ফুচকাওয়ালাকে খুঁজে পেয়েছি! অসাধারণ!&rdquo;
          </p>
          <p className="mt-3 text-xs font-medium text-primary">— রাফি আহমেদ, ঢাকা</p>
        </motion.div>
      </div>

      {/* Right — Form panel */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5 p-6 lg:hidden">
          <span className="text-2xl">🍜</span>
          <span className="text-lg font-bold tracking-tight font-heading text-primary">স্ট্রিট ফুড</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight font-heading text-foreground">
                লগইন করুন
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                আপনার অ্যাকাউন্টে প্রবেশ করুন
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium">ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  className="h-11 border-primary/10 bg-secondary/30 focus-visible:border-primary/40"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-11 border-primary/10 bg-secondary/30 focus-visible:border-primary/40"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    লগইন হচ্ছে...
                  </span>
                ) : (
                  "লগইন করুন"
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/signup" className="font-semibold text-primary transition-colors hover:text-primary/80">
                নতুন অ্যাকাউন্ট তৈরি করুন
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
