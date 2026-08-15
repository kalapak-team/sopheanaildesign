"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User, FileText, LogOut, ChevronDown } from "lucide-react";
import { mediaUrl } from "./media";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string | null;
};

type Props = {
  user: AdminUser | null;
  onProfile: () => void;
  onInhalte: () => void;
  onLogout: () => void;
};

export function ProfileMenu({ user, onProfile, onInhalte, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = (user?.name || "A")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarSrc = mediaUrl(user?.avatar);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-2.5 shadow-sm transition hover:border-brand-pink/40 hover:shadow"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-neutral-100 ring-2 ring-brand-pink/25">
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image
              src="/images/brand/logo.png"
              alt="Sophea"
              width={36}
              height={36}
              className="h-full w-full object-contain p-0.5"
            />
          )}
        </span>
        <span className="hidden max-w-[120px] truncate text-left text-sm font-semibold text-neutral-800 sm:block">
          {user?.name || "Admin"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-neutral-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1.5 shadow-xl shadow-neutral-300/40"
        >
          <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-neutral-600">{initials}</span>
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-xs text-neutral-400">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onProfile();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 transition hover:bg-neutral-50 hover:text-brand-pink"
          >
            <User className="h-4 w-4" />
            My Profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onInhalte();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 transition hover:bg-neutral-50 hover:text-brand-pink"
          >
            <FileText className="h-4 w-4" />
            Inhalte
          </button>
          <div className="my-1 border-t border-neutral-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
