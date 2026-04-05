import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">শর্তাবলী 📋</h1>
        <p className="mt-2 text-xs text-muted-foreground">সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৬</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">সেবার শর্ত</h2>
            <p>
              স্ট্রিট ফুড প্ল্যাটফর্ম ব্যবহার করে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন। আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">অ্যাকাউন্ট</h2>
            <p>
              আপনার অ্যাকাউন্টের নিরাপত্তা আপনার দায়িত্ব। সঠিক ও সত্য তথ্য প্রদান করা বাধ্যতামূলক। অন্যের অ্যাকাউন্ট ব্যবহার করা নিষিদ্ধ।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">রিভিউ নীতি</h2>
            <p>
              রিভিউ অবশ্যই সৎ ও বাস্তব অভিজ্ঞতার উপর ভিত্তি করে হতে হবে। মিথ্যা, আপত্তিকর বা ঘৃণামূলক কনটেন্ট অবিলম্বে মুছে ফেলা হবে এবং অ্যাকাউন্ট নিষিদ্ধ হতে পারে।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">দোকানদার</h2>
            <p>
              দোকানদার হিসেবে নিবন্ধন করলে আপনার দোকানের সঠিক তথ্য প্রদান করতে হবে। ভুল তথ্য প্রদান করলে অ্যাকাউন্ট স্থগিত করা হতে পারে।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">দায়বদ্ধতা</h2>
            <p>
              স্ট্রিট ফুড শুধুমাত্র একটি প্ল্যাটফর্ম। খাবারের মান, স্বাস্থ্যবিধি বা দোকানের সেবার জন্য আমরা সরাসরি দায়ী নই। তবে আমরা সমস্যার সমাধানে সর্বোচ্চ চেষ্টা করি।
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">যোগাযোগ</h2>
            <p>
              শর্তাবলী সম্পর্কিত প্রশ্নের জন্য{" "}
              <span className="font-medium text-foreground">legal@streetfood.com.bd</span>{" "}
              তে ইমেইল করুন।
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
