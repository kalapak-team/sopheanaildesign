"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

/**
 * Literal tokens from sopheanaildesign.webflow.io's production CSS
 * (.navbar / .navbar-container / .nav-menu / .nav-link). Reproduced as
 * inline styles (not reinterpreted Tailwind utilities) so the browser's own
 * flex algorithm lays things out identically to the source site.
 */
const leftLinks = [
  { href: "#uber-mich", label: "ÜBER MICH" },
  { href: "#dienstleistungen", label: "DIENSTLEISTUNGEN" },
];

const rightLinks = [
  { href: "#Aktionen", label: "AKTIONEN" },
  { href: "#preise", label: "PREISE" },
  { href: "#kontakt", label: "KONTAKT" },
];

const allLinks = [...leftLinks, ...rightLinks];

type HeaderProps = {
  variant?: "hero" | "solid";
};

function NavLink({ href, label }: { href: string; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: "#fff",
        letterSpacing: "0.75px",
        textTransform: "uppercase",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        paddingLeft: "0.75px",
        paddingBottom: hover ? "16px" : 0,
        fontFamily: "var(--font-poppins)",
        fontSize: "12px",
        fontWeight: 600,
        display: "flex",
        borderBottom: hover ? "4px solid #ddd" : "none",
        whiteSpace: "nowrap",
        transition: "padding-bottom 0.1s, border-bottom 0.1s",
      }}
    >
      {label}
    </a>
  );
}

function NavMenu({ links }: { links: { href: string; label: string }[] }) {
  return (
    <nav
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        justifyContent: "space-around",
        width: "485px",
        height: "100px",
        display: "flex",
      }}
    >
      {links.map((link) => (
        <NavLink key={link.label} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}

export function Header({ variant = "hero" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const isHero = variant === "hero";

  if (!isHero) {
    return (
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-10 px-6 py-4">
          <nav className="hidden gap-10 md:flex">
            {allLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-semibold uppercase tracking-[0.5px] text-black transition hover:text-brand-pink"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* .navbar (>=992px only, matches w-hidden-medium/small/tiny on the source site) */}
      <div
        className="relative z-20 hidden min-[992px]:flex"
        style={{
          backgroundColor: "transparent",
          justifyContent: "center",
          width: "100%",
          minHeight: "200px",
          position: "static",
        }}
      >
        <div
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
            width: "100%",
            maxWidth: "1280px",
            height: "200px",
            display: "flex",
          }}
        >
          <NavMenu links={leftLinks} />
          <NavMenu links={rightLinks} />
        </div>
      </div>

      {/* Mobile/tablet menu button (<992px) */}
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
            {allLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold uppercase tracking-[0.75px]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
