import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-2xl">🍜</span>
              <span className="text-lg font-bold tracking-tight">স্ট্রিট ফুড</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              বাংলাদেশের সেরা স্ট্রিট ফুড খুঁজুন, রিভিউ দিন এবং আপনার পছন্দের খাবার সবার সাথে শেয়ার করুন।
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">এক্সপ্লোর</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/search" className="transition-colors hover:text-foreground">খাবার খুঁজুন</Link></li>
              <li><Link href="/stores" className="transition-colors hover:text-foreground">দোকান দেখুন</Link></li>
              <li><Link href="/popular" className="transition-colors hover:text-foreground">জনপ্রিয় খাবার</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">অ্যাকাউন্ট</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/profile" className="transition-colors hover:text-foreground">প্রোফাইল</Link></li>
              <li><Link href="/my-reviews" className="transition-colors hover:text-foreground">আমার রিভিউ</Link></li>
              <li><Link href="/settings" className="transition-colors hover:text-foreground">সেটিংস</Link></li>
              <li><Link href="/help" className="transition-colors hover:text-foreground">সাহায্য</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">আমাদের সম্পর্কে</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/about" className="transition-colors hover:text-foreground">আমাদের গল্প</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-foreground">যোগাযোগ</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-foreground">গোপনীয়তা নীতি</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-foreground">শর্তাবলী</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © ২০২৬ স্ট্রিট ফুড। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>তৈরি করা হয়েছে</span>
            <span className="text-red-500">❤</span>
            <span>দিয়ে বাংলাদেশ থেকে</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
