"use client";

const reviews = [
  {
    user: "রাফি আহমেদ",
    food: "ফুচকা",
    store: "রহিমের ফুচকা কর্নার",
    rating: "৫",
    text: "অসাধারণ স্বাদ! টক-ঝাল-মিষ্টির একদম পারফেক্ট ব্যালেন্স। প্রতি সপ্তাহে আসি।",
    time: "২ ঘণ্টা আগে",
  },
  {
    user: "সামিয়া খান",
    food: "বিরিয়ানি",
    store: "স্টার বিরিয়ানি হাউজ",
    rating: "৪",
    text: "বিরিয়ানি ভালো ছিল, তবে মাংসের টুকরো আরেকটু বড় হলে ভালো হতো।",
    time: "৫ ঘণ্টা আগে",
  },
  {
    user: "তানভীর হোসেন",
    food: "চটপটি",
    store: "মামুনের চটপটি",
    rating: "৫",
    text: "ঢাকার সেরা চটপটি বলতে গেলে এটাই। ডিম আর তেঁতুলের চাটনি দারুণ!",
    time: "১ দিন আগে",
  },
  {
    user: "নুসরাত জাহান",
    food: "মিষ্টি",
    store: "রয়্যাল মিষ্টি ঘর",
    rating: "৫",
    text: "রসগোল্লা এত নরম আর রসালো! মনে হচ্ছিল পুরান ঢাকার আসল স্বাদ পাচ্ছি।",
    time: "২ দিন আগে",
  },
];

function Stars({ count }: { count: string }) {
  return (
    <span className="text-yellow-500">
      {"★".repeat(Number(count))}
      {"☆".repeat(5 - Number(count))}
    </span>
  );
}

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">রিভিউ পড়ুন ⭐</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        অন্যদের অভিজ্ঞতা জানুন, সেরা খাবার বেছে নিন
      </p>

      <div className="mt-8 space-y-4">
        {reviews.map((r) => (
          <div
            key={r.user + r.food}
            className="rounded-xl border border-border/60 p-5 transition-all hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {r.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.user}</p>
                  <p className="text-xs text-muted-foreground">{r.time}</p>
                </div>
              </div>
              <Stars count={r.rating} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{r.text}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5">{r.food}</span>
              <span>•</span>
              <span>{r.store}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
