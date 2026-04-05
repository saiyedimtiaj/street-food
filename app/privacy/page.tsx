import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🍜</span>
            <span className="font-bold tracking-tight">স্ট্রিট ফুড</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
            লগইন
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">গোপনীয়তা নীতি 🔒</h1>
        <p className="mt-2 text-xs text-muted-foreground">সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৬</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">তথ্য সংগ্রহ</h2>
            <p>
              আমরা আপনার নাম, ইমেইল এবং প্রোফাইল তথ্য সংগ্রহ করি যখন আপনি অ্যাকাউন্ট তৈরি করেন। রিভিউ এবং রেটিং দেওয়ার সময় আপনার প্রদত্ত তথ্যও সংগ্রহ করা হয়।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">তথ্যের ব্যবহার</h2>
            <p>
              আপনার তথ্য শুধুমাত্র সেবা প্রদান, অ্যাকাউন্ট পরিচালনা এবং অভিজ্ঞতা উন্নত করতে ব্যবহৃত হয়। আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করি না।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">তথ্যের নিরাপত্তা</h2>
            <p>
              আমরা আপনার তথ্যের নিরাপত্তা নিশ্চিত করতে এনক্রিপশন এবং নিরাপদ সার্ভার ব্যবহার করি। তবে ইন্টারনেটে ১০০% নিরাপত্তার নিশ্চয়তা দেওয়া সম্ভব নয়।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">কুকিজ</h2>
            <p>
              আমরা অথেনটিকেশন এবং সেশন পরিচালনার জন্য কুকিজ ব্যবহার করি। আপনি আপনার ব্রাউজার সেটিংস থেকে কুকিজ নিয়ন্ত্রণ করতে পারেন।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">যোগাযোগ</h2>
            <p>
              গোপনীয়তা সম্পর্কিত যেকোনো প্রশ্নের জন্য{" "}
              <span className="font-medium text-foreground">privacy@streetfood.com.bd</span>{" "}
              তে ইমেইল করুন।
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
