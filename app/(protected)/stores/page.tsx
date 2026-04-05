"use client";

const stores = [
  { name: "রহিমের ফুচকা কর্নার", area: "ধানমন্ডি, ঢাকা", rating: "৪.৮", emoji: "🍢" },
  { name: "স্টার বিরিয়ানি হাউজ", area: "গুলিস্তান, ঢাকা", rating: "৪.৫", emoji: "🥘" },
  { name: "মামুনের চটপটি", area: "মিরপুর, ঢাকা", rating: "৪.৭", emoji: "🍡" },
  { name: "ফ্রেশ জুস পয়েন্ট", area: "উত্তরা, ঢাকা", rating: "৪.৩", emoji: "🥤" },
  { name: "রয়্যাল মিষ্টি ঘর", area: "চকবাজার, ঢাকা", rating: "৪.৯", emoji: "🍰" },
  { name: "ক্রিস্পি ফ্রাইড চিকেন", area: "বনানী, ঢাকা", rating: "৪.৬", emoji: "🍗" },
];

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">দোকান দেখুন 🏪</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        জনপ্রিয় স্ট্রিট ফুডের দোকানগুলো ব্রাউজ করুন
      </p>

      <div className="mt-8 space-y-3">
        {stores.map((store) => (
          <div
            key={store.name}
            className="flex items-center gap-4 rounded-xl border border-border/60 p-4 transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 text-2xl">
              {store.emoji}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{store.name}</h3>
              <p className="text-sm text-muted-foreground">{store.area}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              <span>⭐</span>
              <span>{store.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
