import Link from "next/link";

export default function ContactPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">যোগাযোগ 📬</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          আমাদের সাথে যোগাযোগ করুন — আমরা আপনার কথা শুনতে চাই
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border/60 p-6 text-center">
            <span className="text-2xl">📧</span>
            <h3 className="text-sm font-semibold">ইমেইল</h3>
            <p className="text-xs text-muted-foreground">info@streetfood.com.bd</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border/60 p-6 text-center">
            <span className="text-2xl">📞</span>
            <h3 className="text-sm font-semibold">ফোন</h3>
            <p className="text-xs text-muted-foreground">+৮৮০ ১৭XX-XXXXXX</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border/60 p-6 text-center">
            <span className="text-2xl">📍</span>
            <h3 className="text-sm font-semibold">ঠিকানা</h3>
            <p className="text-xs text-muted-foreground">ঢাকা, বাংলাদেশ</p>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-border/60 p-6">
          <h2 className="text-sm font-semibold">মেসেজ পাঠান</h2>
          <form className="mt-5 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">নাম</label>
              <input
                type="text"
                placeholder="আপনার নাম"
                className="h-10 rounded-lg border border-border bg-transparent px-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">ইমেইল</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="h-10 rounded-lg border border-border bg-transparent px-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">মেসেজ</label>
              <textarea
                rows={4}
                placeholder="আপনার মেসেজ লিখুন..."
                className="rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              পাঠান
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
