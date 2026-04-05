"use client";

export default function MyReviewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">আমার রিভিউ ✍️</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        আপনি যেসব রিভিউ দিয়েছেন
      </p>

      <div className="mt-16 flex flex-col items-center text-center">
        <span className="text-5xl">📝</span>
        <h2 className="mt-4 text-lg font-semibold">কোনো রিভিউ নেই</h2>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          আপনি এখনো কোনো রিভিউ দেননি। আপনার পছন্দের খাবারের রিভিউ লিখে অন্যদের সাহায্য করুন!
        </p>
      </div>
    </div>
  );
}
