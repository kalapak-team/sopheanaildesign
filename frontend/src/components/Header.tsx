"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteNav } from "@/lib/site";

const leftLinks = siteNav.slice(0, 2);
const rightLinks = siteNav.slice(2);

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="hero-nav-link box-border flex h-full flex-1 items-center justify-center whitespace-nowrap pl-px text-[12px] font-semibold uppercase tracking-[0.75px] text-white"
    >
      {label}
    </Link>
  );
}

function NavMenu({ links }: { links: readonly { href: string; label: string }[] }) {
  return (
    <nav className="flex h-[100px] w-[485px] justify-around border-b border-white/10">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* desktop only — webflow hides this below 992 */}
      <div className="relative z-20 hidden min-h-[200px] w-full justify-center min-[992px]:flex">
        <div className="flex h-[200px] w-full max-w-[1280px] flex-row items-stretch justify-between">
          <NavMenu links={leftLinks} />
          <NavMenu links={rightLinks} />
        </div>
      </div>

      <div className="absolute right-4 top-4 z-30 min-[992px]:hidden">
        <button
          type="button"
          className="p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-16 z-30 bg-black/85 px-4 py-4 text-white min-[992px]:hidden">
          <div className="flex flex-col gap-4">
            {siteNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold uppercase tracking-[0.75px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
