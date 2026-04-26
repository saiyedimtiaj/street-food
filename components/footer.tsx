import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-primary/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl transition-transform group-hover:scale-110">🍜</span>
              <span className="text-lg font-bold tracking-tight font-heading text-primary glow-text">স্ট্রিট ফুড</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              বাংলাদেশের সেরা স্ট্রিট ফুড খুঁজুন, রিভিউ দিন এবং আপনার পছন্দের খাবার সবার সাথে শেয়ার করুন।
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground font-heading">এক্সপ্লোর</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/stores" className="transition-colors hover:text-primary">দোকান দেখুন</Link></li>
              <li><Link href="/popular" className="transition-colors hover:text-primary">জনপ্রিয় খাবার</Link></li>
              <li><Link href="/suggest" className="transition-colors hover:text-primary">সাজেস্ট করুন</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground font-heading">অ্যাকাউন্ট</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/profile" className="transition-colors hover:text-primary">প্রোফাইল</Link></li>
              <li><Link href="/my-reviews" className="transition-colors hover:text-primary">আমার রিভিউ</Link></li>
              <li><Link href="/settings" className="transition-colors hover:text-primary">সেটিংস</Link></li>
              <li><Link href="/help" className="transition-colors hover:text-primary">সাহায্য</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground font-heading">আমাদের সম্পর্কে</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/about" className="transition-colors hover:text-primary">আমাদের গল্প</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">যোগাযোগ</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-primary">গোপনীয়তা নীতি</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-primary">শর্তাবলী</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © ২০২৬ স্ট্রিট ফুড। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>তৈরি করা হয়েছে</span>
            <span className="text-primary">🔥</span>
            <span>দিয়ে বাংলাদেশ থেকে</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
