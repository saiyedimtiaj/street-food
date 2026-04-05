

export default function AboutPage() {
  return (
    <div>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">আমাদের গল্প 📖</h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            বাংলাদেশের রাস্তায় রাস্তায় ছড়িয়ে আছে অসংখ্য খাবারের দোকান — ফুচকাওয়ালা থেকে শুরু করে বিরিয়ানির ভাণ্ডার। কিন্তু সেরা খাবারটা খুঁজে পাওয়া সবসময় সহজ নয়।
          </p>
          <p>
            <strong className="text-foreground">স্ট্রিট ফুড</strong> তৈরি হয়েছে এই সমস্যার সমাধানে। আমরা বিশ্বাস করি প্রতিটি মানুষের কাছে তার এলাকার সেরা খাবারের তথ্য থাকা উচিত — আর প্রতিটি দোকানদারের তার কাস্টমারদের কাছে পৌঁছানোর সুযোগ থাকা উচিত।
          </p>

          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/60 p-5 text-center">
              <span className="text-3xl">🎯</span>
              <h3 className="mt-2 font-semibold text-foreground">লক্ষ্য</h3>
              <p className="mt-1 text-xs">স্ট্রিট ফুড কালচারকে ডিজিটাল করা</p>
            </div>
            <div className="rounded-xl border border-border/60 p-5 text-center">
              <span className="text-3xl">💡</span>
              <h3 className="mt-2 font-semibold text-foreground">ভিশন</h3>
              <p className="mt-1 text-xs">সবার জন্য সেরা খাবারের তথ্য সহজলভ্য করা</p>
            </div>
            <div className="rounded-xl border border-border/60 p-5 text-center">
              <span className="text-3xl">🤝</span>
              <h3 className="mt-2 font-semibold text-foreground">কমিউনিটি</h3>
              <p className="mt-1 text-xs">খাবার প্রেমীদের একত্র করা</p>
            </div>
          </div>

          <p className="pt-4">
            আমরা একটি ছোট টিম, কিন্তু আমাদের স্বপ্ন বড়। প্রতিটি রিভিউ, প্রতিটি রেটিং আমাদের এক ধাপ এগিয়ে নিয়ে যায়। আপনিও এই যাত্রায় যোগ দিন। 🚀
          </p>
        </div>
      </main>
    </div>
  );
}
