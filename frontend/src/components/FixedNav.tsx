"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

/**
 * Literal reproduction of sopheanaildesign.webflow.io's
 * .desktop-fixed-navbar / .mobile-fixed-navbar: a white bar (logo + links)
 * that is fixed to the top of the viewport and off-screen (translateY(-100%))
 * until the user scrolls past the dark hero, then slides down and stays
 * pinned while scrolling the rest of the page.
 */
const links = [
  { href: "#uber-mich", label: "Über Mich" },
  { href: "#dienstleistungen", label: "Diensleistungen" },
  { href: "#Aktionen", label: "Aktionen" },
  { href: "#preise", label: "Preise" },
  { href: "#kontakt", label: "Kontakt" },
];

export function FixedNav({
  logoSrc = "/images/brand/logo-full.png",
}: {
  logoSrc?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const remote = logoSrc.includes("/storage/");

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("home");
      const threshold = hero ? hero.getBoundingClientRect().bottom : window.innerHeight;
      setVisible(threshold <= 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* .desktop-fixed-navbar (>=992px) */}
      <div
        className={`fixed inset-x-0 top-0 z-[10000] hidden h-[100px] items-center justify-center border-b border-black/10 bg-white px-[12.5px] transition-transform duration-300 min-[992px]:flex ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex h-full w-full items-stretch justify-between">
          <a href="#home" className="mr-[150px] flex items-center">
            <Image
              src={logoSrc}
              alt="Sophea Naildesign"
              width={211}
              height={50}
              className="h-[50px] w-auto"
              unoptimized={remote}
            />
          </a>
          <nav className="flex h-full">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex h-full items-center whitespace-nowrap border-b-4 border-transparent py-5 pl-[20.75px] pr-5 text-[12px] font-semibold uppercase text-[#151515] hover:border-[#fc03a1]"
                style={{ fontFamily: "var(--font-poppins)", letterSpacing: "0.75px" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div aria-hidden />
        </div>
      </div>

      {/* .mobile-fixed-navbar (<992px) */}
      <div
        className={`fixed inset-x-0 top-0 z-[5000] flex h-[75px] items-center justify-between border-b border-[#f5f5f5] bg-white px-[25px] shadow-[0_0_25px_rgba(0,0,0,0.35)] transition-transform duration-300 min-[992px]:hidden ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <a href="#home" className="flex items-center">
          <Image
            src={logoSrc}
            alt="Sophea Naildesign"
            width={169}
            height={40}
            className="h-10 w-auto"
            unoptimized={remote}
          />
        </a>
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
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-[#f5f5f5] py-3 text-[12px] font-semibold uppercase text-[#151515]"
              style={{ fontFamily: "var(--font-poppins)", letterSpacing: "0.75px" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
