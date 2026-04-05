"use client";

const faqItems = [
  {
    q: "কীভাবে রিভিউ দেব?",
    a: "যেকোনো দোকানের পেজে গিয়ে 'রিভিউ দিন' বাটনে ক্লিক করুন। আপনার অভিজ্ঞতা লিখুন এবং রেটিং দিন।",
  },
  {
    q: "দোকান কীভাবে রেজিস্টার করব?",
    a: "সাইন আপ করার সময় 'দোকান পরিচালনা করতে' অপশনটি বেছে নিন। তারপর আপনার দোকানের তথ্য দিন।",
  },
  {
    q: "আমার রিভিউ কি এডিট করা যাবে?",
    a: "হ্যাঁ, 'আমার রিভিউ' পেজ থেকে যেকোনো রিভিউ এডিট বা ডিলিট করতে পারবেন।",
  },
  {
    q: "অ্যাকাউন্ট ডিলিট কীভাবে করব?",
    a: "সেটিংস পেজ থেকে অ্যাকাউন্ট ডিলিটের অনুরোধ করতে পারবেন। এটি ৩০ দিনের মধ্যে কার্যকর হবে।",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">সাহায্য ❓</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর
      </p>

      <div className="mt-8 space-y-3">
        {faqItems.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-border/60 transition-all open:border-primary/30 open:shadow-sm"
          >
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-foreground">
              {item.q}
              <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="border-t border-border/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border/60 p-6 text-center">
        <span className="text-3xl">💬</span>
        <h2 className="mt-3 font-semibold">আরো সাহায্য দরকার?</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          আমাদের সাথে যোগাযোগ করুন:{" "}
          <span className="font-medium text-foreground">help@streetfood.com.bd</span>
        </p>
      </div>
    </div>
  );
}
