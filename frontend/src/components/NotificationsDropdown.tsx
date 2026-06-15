"use client";

import { useState, useEffect, useRef } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "update" | "alert" | "success" | "info";
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Manual Processed",
    message: "Xiaomi Mi Electric Scooter 4 Pro user manual has been successfully indexed and is ready for AI queries.",
    time: "2 min ago",
    read: false,
    type: "success",
  },
  {
    id: "n2",
    title: "Diagnostic Complete",
    message: "Your diagnostic session for Sony WH-1000XM5 has identified 3 potential issues. Review the suggested actions.",
    time: "15 min ago",
    read: false,
    type: "update",
  },
  {
    id: "n3",
    title: "Company Invitation",
    message: "You've been invited to join 'Tech Solutions Inc.' as a member. Check your invitations page.",
    time: "1 hour ago",
    read: false,
    type: "info",
  },
  {
    id: "n4",
    title: "Product Update",
    message: "New firmware version 2.4.1 is available for your DJI Mini 4 Pro drone. Update via the DJI Fly app.",
    time: "3 hours ago",
    read: false,
    type: "info",
  },
  {
    id: "n5",
    title: "Battery Warning",
    message: "Your Roomba j9+ vacuum battery is showing reduced capacity. Consider replacement if performance degrades.",
    time: "1 day ago",
    read: true,
    type: "alert",
  },
  {
    id: "n6",
    title: "Account Activity",
    message: "New login from Chrome on macOS. If this wasn't you, please secure your account immediately.",
    time: "2 days ago",
    read: true,
    type: "alert",
  },
];

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-mantis-green text-[8px] font-bold text-white ring-2 ring-white dark:ring-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl dark:shadow-black/40 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-mantis-green hover:text-mantis-green-dark transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-slate-400">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markOneRead(n.id); }}
                  className={`w-full flex gap-3 px-4 py-3 text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-[var(--card-border)] last:border-b-0 ${
                    !n.read ? "bg-mantis-green-light/50 dark:bg-green-950/10" : ""
                  }`}
                >
                  <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                    n.type === "alert" ? "bg-red-500" :
                    n.type === "success" ? "bg-mantis-green" :
                    n.type === "update" ? "bg-blue-500" :
                    "bg-slate-400"
                  } ${n.read ? "opacity-30" : ""}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold ${!n.read ? "text-[var(--foreground)]" : "text-slate-500 dark:text-slate-400"}`}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
