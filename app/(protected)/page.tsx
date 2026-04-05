"use client";

import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  const { user } = useAuth();

  if (!user) return null;

  return null;
}
