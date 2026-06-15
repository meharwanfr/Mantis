"use client";

import Link from "next/link";

export default function Home() {
  const categories = [
    {
      name: "Electric Scooters",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M6 15h11a1 1 0 001-1V5a1 1 0 00-1-1H9" />
        </svg>
      ),
    },
    {
      name: "Audio",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        </svg>
      ),
    },
    {
      name: "Cameras",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      ),
    },
    {
      name: "Home Appliances",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="4" y1="10" x2="20" y2="10" />
          <circle cx="12" cy="15" r="3" />
        </svg>
      ),
    },
    {
      name: "Accessories",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "View All",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      title: "Describe Your Issue",
      desc: "Tell us what's wrong in your own words.",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: "Get AI Guidance",
      desc: "AI analyzes the manual to suggest possible causes.",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Follow Steps",
      desc: "Follow targeted diagnostic actions with manual references.",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: "Problem Solved",
      desc: "Diagnose the fault and implement the recommended fix.",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const recentManuals = [
    {
      id: "xiaomi-scooter-4-pro",
      name: "Xiaomi Mi Electric Scooter 4 Pro",
      type: "User Manual",
      icon: (
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <circle cx="6" cy="18" r="3" /><circle cx="18" cy="18" r="3" />
          <path d="M6 15h11a1 1 0 001-1V5a1 1 0 00-1-1H9" />
        </svg>
      ),
    },
    {
      id: "sony-wh1000xm5",
      name: "Sony WH-1000XM5 Headphones",
      type: "User Guide",
      icon: (
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9M3 14v3a2 2 0 002 2h2v-6H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      id: "canon-eos-r50",
      name: "Canon EOS R50 Camera",
      type: "Reference Manual",
      icon: (
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      ),
    },
    {
      id: "dyson-v15-detect",
      name: "Dyson V15 Detect Vacuum",
      type: "User Manual",
      icon: (
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path d="M19 11V5a2 2 0 00-2-2H7a2 2 0 00-2 2v6m14 0a4 4 0 01-4 4H9a4 4 0 01-4-4m14 0v9a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5a1 1 0 00-1-1H9a1 1 0 00-1 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-9" />
        </svg>
      ),
    },
    {
      id: "apple-airpods-pro-2",
      name: "Apple AirPods Pro 2nd Gen",
      type: "User Guide",
      icon: (
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Section — Split Layout */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="md:col-span-7 flex flex-col">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 shadow-sm mb-6 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-mantis-green animate-pulse" />
              AI-powered product diagnostics
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              Support for every
              <span className="text-mantis-green block mt-1">product you own</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Get instant, accurate answers to any product issue. Upload manuals,
              ask questions, and let AI guide you through every fix.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/diagnostics"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-mantis-green px-7 text-sm font-semibold text-white shadow-sm hover:bg-mantis-green-dark transition-all active:scale-[0.98]"
              >
                Ask a Question
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-7 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                Browse Products
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl bg-gradient-to-br from-mantis-green/5 to-mantis-green/10 dark:from-mantis-green/5 dark:to-green-950/20 border border-[var(--card-border)] p-5 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(22,163,74,0.08),transparent_60%)]" />
              <div className="relative grid grid-cols-2 gap-3 w-full h-full">
                <div className="flex flex-col gap-3">
                  <div className="flex-1 rounded-2xl bg-white dark:bg-slate-900 border border-[var(--card-border)] p-4 flex items-center justify-center shadow-sm">
                    <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <circle cx="6" cy="18" r="3" /><circle cx="18" cy="18" r="3" />
                      <path d="M6 15h11a1 1 0 001-1V5a1 1 0 00-1-1H9" />
                    </svg>
                  </div>
                  <div className="flex-1 rounded-2xl bg-white dark:bg-slate-900 border border-[var(--card-border)] p-4 flex items-center justify-center shadow-sm">
                    <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9M3 14v3a2 2 0 002 2h2v-6H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-6">
                  <div className="flex-1 rounded-2xl bg-white dark:bg-slate-900 border border-[var(--card-border)] p-4 flex items-center justify-center shadow-sm">
                    <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <div className="flex-1 rounded-2xl bg-white dark:bg-slate-900 border border-[var(--card-border)] p-4 flex items-center justify-center shadow-sm">
                    <svg className="h-10 w-10 text-mantis-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-mantis-green/10 blur-2xl" />
              <div className="absolute -top-2 -left-2 h-20 w-20 rounded-full bg-mantis-green/5 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-[var(--card-border)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
          {[
            { value: "15+", label: "Products Supported" },
            { value: "24/7", label: "AI Diagnostics" },
            { value: "100+", label: "Manual Pages Indexed" },
            { value: "99%", label: "Diagnostic Accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)]">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Find your product and start diagnosing</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 text-center hover:shadow-md dark:shadow-black/20 hover:border-mantis-green/30 dark:hover:border-mantis-green/30 transition-all group active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--section-bg)] group-hover:bg-mantis-green-light dark:group-hover:bg-green-950/30 text-slate-500 dark:text-slate-400 group-hover:text-mantis-green transition-colors">
                {cat.icon}
              </div>
              <h3 className="mt-3 font-semibold text-xs text-[var(--foreground)] group-hover:text-mantis-green transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-2xl font-bold text-[var(--foreground)] sm:text-3xl">How It Works</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Four simple steps to troubleshoot any product</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-start p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mantis-green-light dark:bg-green-950/40 text-mantis-green">
                {step.icon}
              </div>
              <h3 className="mt-4 font-semibold text-sm text-[var(--foreground)]">{step.title}</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Recently Added</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest product manuals and guides</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-mantis-green hover:text-mantis-green-dark transition-colors"
          >
            View All
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentManuals.map((man) => (
            <Link
              key={man.id}
              href={`/products/${man.id}`}
              className="flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 hover:shadow-md dark:shadow-black/20 hover:border-mantis-green/30 dark:hover:border-mantis-green/30 transition-all group active:scale-[0.98]"
            >
              <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-[var(--section-bg)] p-4 mb-3">
                {man.icon}
              </div>
              <h3 className="font-semibold text-xs text-[var(--foreground)] leading-snug group-hover:text-mantis-green transition-colors line-clamp-2">
                {man.name}
              </h3>
              <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">{man.type}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-mantis-green hover:text-mantis-green-dark transition-colors"
          >
            View All Manuals
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 border-t border-[var(--card-border)] text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Ready to troubleshoot?</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Upload your product manual and let our AI help you diagnose and fix any issue.
          </p>
          <Link
            href="/diagnostics"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-mantis-green px-8 text-sm font-semibold text-white shadow-sm hover:bg-mantis-green-dark transition-all active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
