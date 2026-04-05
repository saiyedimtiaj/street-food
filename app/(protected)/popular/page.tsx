"use client";

const popularItems = [
  { rank: "০১", name: "ফুচকা", reviews: "২,৩৪০", emoji: "🍢", trend: "🔥" },
  { rank: "০২", name: "বিরিয়ানি", reviews: "১,৮৯০", emoji: "🥘", trend: "🔥" },
  { rank: "০৩", name: "চটপটি", reviews: "১,৫৬০", emoji: "🍡", trend: "📈" },
  { rank: "০৪", name: "ঝালমুড়ি", reviews: "১,২৩০", emoji: "🥜", trend: "📈" },
  { rank: "০৫", name: "শিঙ্গাড়া", reviews: "১,১০০", emoji: "🧆", trend: "📈" },
  { rank: "০৬", name: "রসগোল্লা", reviews: "৯৮০", emoji: "🍰", trend: "⭐" },
  { rank: "০৭", name: "লাচ্ছি", reviews: "৮৫০", emoji: "🥤", trend: "⭐" },
  { rank: "০৮", name: "ফ্রাইড চিকেন", reviews: "৭৭০", emoji: "🍗", trend: "⭐" },
];

export default function PopularPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">জনপ্রিয় খাবার 🔥</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        সবচেয়ে বেশি রিভিউ পাওয়া খাবারগুলো
      </p>

      <div className="mt-8 space-y-2">
        {popularItems.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-4 rounded-xl border border-border/60 px-5 py-4 transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <span className="text-lg font-bold text-muted-foreground/50">{item.rank}</span>
            <span className="text-2xl">{item.emoji}</span>
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.reviews} রিভিউ</p>
            </div>
            <span className="text-lg">{item.trend}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
