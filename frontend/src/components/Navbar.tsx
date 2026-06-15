"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import NotificationsDropdown from "./NotificationsDropdown";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Diagnostics", href: "/diagnostics" },
  ];

  if (user) {
    navLinks.push({ name: "Dashboard", href: "/dashboard" });
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--card-border)] bg-[var(--nav-blur)] backdrop-blur-xl supports-backdrop-blur:bg-[var(--nav-blur)] transition-colors duration-300">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <svg
                className="h-7 w-7 text-mantis-green"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M50 15C55 25 75 35 75 55C75 75 60 85 50 85C40 85 25 75 25 55C25 35 45 25 50 15Z" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M50 15V85" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" />
                <circle cx="50" cy="30" r="7" fill="currentColor" />
                <path d="M45 25C40 20 38 12 38 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M55 25C60 20 62 12 62 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="font-display text-lg font-bold tracking-tight text-[var(--foreground)]">
                Mantis
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "text-mantis-green bg-mantis-green-light/80 dark:bg-green-950/30 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Quick Search (desktop) */}
            <div className="relative hidden lg:block w-56">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-lg border border-[var(--card-border)] bg-slate-50/50 dark:bg-slate-900/50 py-1.5 pl-9 pr-3 text-xs outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-mantis-green focus:bg-white dark:focus:bg-slate-900/80 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications (when logged in) */}
            {user && <NotificationsDropdown />}

            {/* Profile / Auth */}
            {isLoading ? (
              <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : user ? (
              <Link
                href="/profile"
                className="h-7 w-7 rounded-full bg-mantis-green flex items-center justify-center text-white font-semibold text-xs shadow-sm hover:shadow-md hover:opacity-90 transition-all"
                title="Profile"
              >
                {user.email?.charAt(0).toUpperCase() || "U"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-mantis-green px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-mantis-green-dark transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        user={user}
        onSignOut={signOut}
      />
    </>
  );
}
