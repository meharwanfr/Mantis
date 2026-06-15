"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading, role, companies, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-mantis-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="mx-auto h-20 w-20 rounded-full bg-mantis-green flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4">
          {user.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">Your Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your Mantis account</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-sm">
          <h2 className="font-display font-bold text-[var(--foreground)] text-base mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-[var(--foreground)] mt-0.5">{user.email}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">User ID</p>
              <code className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-0.5 block">{user.id}</code>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</p>
              <span className={`mt-0.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                role === "admin"
                  ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/10"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {role}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Verified</p>
              <span className={`mt-0.5 inline-flex items-center gap-1 text-xs font-semibold ${
                user.email_confirmed_at ? "text-mantis-green" : "text-amber-500"
              }`}>
                {user.email_confirmed_at ? "Verified" : "Pending verification"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-sm">
          <h2 className="font-display font-bold text-[var(--foreground)] text-base mb-4">Company Memberships</h2>
          {companies.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No company memberships yet.</p>
          ) : (
            <div className="space-y-2">
              {companies.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{c.name}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{c.slug}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/10">
                    {c.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl bg-mantis-green px-4 py-3 text-sm font-semibold text-white text-center hover:bg-mantis-green-dark transition-colors shadow-sm"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={signOut}
            className="rounded-xl border border-[var(--card-border)] px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
