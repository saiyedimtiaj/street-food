"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { register, type RegisterPayload } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      router.push("/login");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const msg =
        err.response?.data?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
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
      {/* Left — Form panel */}
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
                অ্যাকাউন্ট তৈরি করুন
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                স্ট্রিট ফুড কমিউনিটিতে যোগ দিন
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm font-medium">আপনার নাম</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="যেমন: রহিম উদ্দিন"
                  required
                  minLength={2}
                  maxLength={100}
                  className="h-11 border-primary/10 bg-secondary/30 focus-visible:border-primary/40"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

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
                  minLength={8}
                  className="h-11 border-primary/10 bg-secondary/30 focus-visible:border-primary/40"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  সর্বনিম্ন ৮ অক্ষর, ১টি বড় হাতের অক্ষর ও ১টি সংখ্যা থাকতে হবে
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">আমি চাই</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "user" })}
                    className={`group flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all ${
                      form.role === "user"
                        ? "border-primary bg-primary/10 text-primary glow-border"
                        : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xl">🔍</span>
                    <span className="text-xs leading-tight">খাবার খুঁজতে ও রিভিউ দিতে</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "store" })}
                    className={`group flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all ${
                      form.role === "store"
                        ? "border-primary bg-primary/10 text-primary glow-border"
                        : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xl">🏪</span>
                    <span className="text-xs leading-tight">দোকান পরিচালনা করতে</span>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    অ্যাকাউন্ট তৈরি হচ্ছে...
                  </span>
                ) : (
                  "অ্যাকাউন্ট তৈরি করুন"
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
                লগইন করুন
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right — Brand panel */}
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden border-l border-primary/10 p-12">
        <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-amber-500/5 blur-[100px]" />

        <div className="flex items-center gap-3 justify-end">
          <span className="text-xl font-bold tracking-tight font-heading text-primary glow-text">স্ট্রিট ফুড</span>
          <span className="text-3xl">🍜</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={staggerItem} className="space-y-2">
            <h2 className="text-4xl font-bold leading-tight tracking-tight font-heading text-foreground">
              আপনার শহরের<br />খাবারের গল্প<br />
              <span className="text-primary glow-text">শুরু হোক এখান থেকে।</span>
            </h2>
            <p className="max-w-md text-lg text-muted-foreground">
              হাজারো খাবার প্রেমী ইতিমধ্যে যোগ দিয়েছেন। আপনিও আজই শুরু করুন!
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-3">
            {[
              { emoji: "📍", text: "আপনার কাছের সেরা খাবার খুঁজুন" },
              { emoji: "⭐", text: "সৎ রিভিউ পড়ুন ও লিখুন" },
              { emoji: "🏪", text: "আপনার দোকান পরিচালনা করুন" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="text-lg">{item.emoji}</span>
                <span>{item.text}</span>
              </div>
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
            &ldquo;দোকান রেজিস্ট্রেশন করার পর থেকে আমার কাস্টমার দ্বিগুণ হয়ে গেছে!&rdquo;
          </p>
          <p className="mt-3 text-xs font-medium text-primary">— করিম মিয়া, চট্টগ্রাম</p>
        </motion.div>
      </div>
    </div>
  );
}
