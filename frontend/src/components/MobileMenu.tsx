"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  user: { email?: string } | null;
  onSignOut: () => void;
}

export default function MobileMenu({ isOpen, onClose, navLinks, user, onSignOut }: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-16 right-0 bottom-0 w-72 max-w-[85vw] bg-[var(--card-bg)] border-l border-[var(--card-border)] shadow-2xl overflow-y-auto animate-slide-in">
        <div className="p-5 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-mantis-green-light dark:bg-green-950/20 text-mantis-green font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {user && (
          <div className="border-t border-[var(--card-border)] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-mantis-green flex items-center justify-center text-white font-semibold text-sm">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--foreground)] truncate">{user.email}</p>
                <Link href="/profile" onClick={onClose} className="text-[10px] text-mantis-green hover:underline font-medium">
                  View Profile
                </Link>
              </div>
            </div>
            <button
              onClick={() => { onSignOut(); onClose(); }}
              className="w-full rounded-xl border border-[var(--card-border)] px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
