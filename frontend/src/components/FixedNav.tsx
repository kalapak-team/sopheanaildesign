"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { shouldUnoptimize } from "@/lib/media";
import { siteNav } from "@/lib/site";

export function FixedNav({
  logoSrc = "/images/brand/logo-full.png",
}: {
  logoSrc?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("home");
      const threshold = hero ? hero.getBoundingClientRect().bottom : window.innerHeight;
      setVisible(threshold <= 0); // slide in once the dark hero is gone
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-[10000] hidden h-[100px] items-center justify-center border-b border-black/10 bg-white px-[12.5px] transition-transform duration-300 min-[992px]:flex ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex h-full w-full items-stretch justify-between">
          <Link href="#home" className="mr-[150px] flex items-center">
            <Image
              src={logoSrc}
              alt="Sophea Naildesign"
              width={211}
              height={50}
              className="h-[50px] w-auto"
              unoptimized={shouldUnoptimize(logoSrc)}
            />
          </Link>
          <nav className="flex h-full">
            {siteNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex h-full items-center whitespace-nowrap border-b-4 border-transparent py-5 pl-[20.75px] pr-5 text-[12px] font-semibold uppercase tracking-[0.75px] text-[#151515] hover:border-[#fc03a1]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div aria-hidden />
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-0 z-[5000] flex h-[75px] items-center justify-between border-b border-[#f5f5f5] bg-white px-[25px] shadow-[0_0_25px_rgba(0,0,0,0.35)] transition-transform duration-300 min-[992px]:hidden ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link href="#home" className="flex items-center">
          <Image
            src={logoSrc}
            alt="Sophea Naildesign"
            width={169}
            height={40}
            className="h-10 w-auto"
            unoptimized={shouldUnoptimize(logoSrc)}
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[#f5f5f5] text-[#151515]"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {visible && open && (
        <div className="fixed inset-x-0 top-[75px] z-[5000] flex flex-col bg-white text-center shadow-lg min-[992px]:hidden">
          {siteNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-[#f5f5f5] py-3 text-[12px] font-semibold uppercase tracking-[0.75px] text-[#151515]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
