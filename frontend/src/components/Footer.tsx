import Image from "next/image";
import type { OpeningHour, SiteSettings } from "@/lib/api";
import { settingImage } from "@/lib/media";

const poppins = { fontFamily: "var(--font-poppins), Poppins, sans-serif" } as const;

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.8 4.8085H18V0.0106242H15.6C13.9803 -0.0886379 12.3958 0.511278 11.2483 1.65823C10.1009 2.80517 9.50069 4.38898 9.6 6.00797V8.40691H6V13.2048H9.6V24H14.4V13.2048H16.8L18 8.40691H14.4V7.20744C14.4 6.00797 14.4 4.8085 16.8 4.8085Z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        fill="currentColor"
      />
    </svg>
  );
}

const linkClass =
  "flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#ffffffb3] transition-colors duration-300 hover:text-[#ececec] min-[992px]:justify-start";

/**
 * Footer — matched to sopheanaildesign.webflow.io `.nail-footer`
 * Mobile: centered stack (logo → phone → hours → standort/nav → social → legal)
 * Desktop: logo/phone left, three columns right
 */
export function Footer({
  settings,
  openingHours,
}: {
  settings: SiteSettings;
  openingHours: OpeningHour[];
}) {
  const footerLogo = settingImage(
    settings,
    "logo_footer_image",
    "/images/brand/logo-footer.png"
  );
  const phone = settings.phone_intl || settings.phone;

  return (
    <footer
      id="kontakt"
      className="relative border-t border-[#303030] bg-[#161616] text-white"
      style={poppins}
    >
      <div className="mx-auto w-[90%] max-w-[1280px] py-12 min-[768px]:py-16 min-[992px]:py-20">
        <div className="grid grid-cols-1 gap-y-12 min-[768px]:gap-y-12 min-[992px]:grid-cols-[0.75fr_auto] min-[992px]:items-start min-[992px]:gap-x-[8vw]">
          {/* Logo + phone — phone always centered under logo */}
          <div className="flex flex-col items-center min-[992px]:max-w-[32rem] min-[992px]:items-start">
            <div className="flex w-[340px] max-w-full flex-col items-center min-[480px]:w-[400px] min-[992px]:w-[520px]">
              <a href="#home" className="mb-6 block w-full min-[992px]:mb-8">
                <Image
                  src={footerLogo}
                  alt="Sophea Naildesign"
                  width={632}
                  height={256}
                  sizes="(max-width: 991px) 400px, 520px"
                  unoptimized
                  className="h-auto w-full"
                />
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="mt-2 block w-full whitespace-nowrap text-center text-[30px] font-bold leading-[1.2] text-[#fffdfd] min-[480px]:text-[35px] min-[992px]:mt-5 min-[992px]:pb-24 min-[992px]:text-[40px]"
              >
                {phone}
              </a>
            </div>
          </div>

          {/* Hours | Standort+nav | Social */}
          <div className="grid grid-cols-1 gap-y-10 min-[480px]:grid-cols-[1fr_1fr_0.25fr] min-[480px]:gap-x-6 min-[480px]:gap-y-10 min-[992px]:gap-x-8">
            {/* Öffnungszeiten */}
            <div className="flex flex-col items-center text-center min-[480px]:items-start min-[480px]:text-left">
              <div className="mb-4 text-sm font-semibold text-[#ececec]">
                Öffnungszeiten
              </div>
              <div className="text-sm font-semibold leading-[1.7] text-[#ffffffb3]">
                {openingHours.map((h) => (
                  <div key={h.id}>
                    <strong className="font-semibold text-[#ffffffb3]">
                      {h.day_label}
                    </strong>
                    - {h.hours}
                  </div>
                ))}
              </div>
            </div>

            {/* Standort + nav */}
            <div className="flex flex-col items-center text-center min-[480px]:items-start min-[480px]:text-left">
              <div className="mb-4 text-sm font-semibold text-[#ececec]">
                Standort
              </div>
              <a href="#" className={linkClass}>
                {settings.address_line1}
              </a>
              <a href="#" className={linkClass}>
                {settings.address_line2}
              </a>
              <a href="#home" className={`${linkClass} uppercase`}>
                HOME
              </a>
              <a
                href="#dienstleistungen"
                className={`${linkClass} uppercase`}
              >
                DIENSTLEISTUNGEN
                <span className="inline-flex items-center rounded-full border border-[#4b4b4b] bg-[#111] px-2.5 py-0.5 text-[10px] font-normal uppercase tracking-[0.05em] text-white opacity-[0.66]">
                  New
                </span>
              </a>
              <a href="#preise" className={`${linkClass} uppercase`}>
                PREISE
              </a>
            </div>

            {/* Social */}
            <div className="flex flex-col items-center text-center min-[480px]:items-start min-[480px]:text-left">
              <div className="mb-4 text-sm font-semibold text-[#ececec]">
                Social
              </div>
              <a
                href={settings.facebook || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center py-2 text-[#ffffffb3] transition-colors duration-300 hover:text-[#ececec] min-[480px]:justify-start"
                aria-label="Facebook"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center min-[480px]:mr-3">
                  <FacebookIcon />
                </span>
              </a>
              <a
                href={settings.instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center py-2 text-[#ffffffb3] transition-colors duration-300 hover:text-[#ececec] min-[480px]:justify-start"
                aria-label="Instagram"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center min-[480px]:mr-3">
                  <InstagramIcon />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom legal — column-reverse on mobile matches Webflow visual order */}
        <div className="mt-12 flex flex-col-reverse items-center gap-3 border-t border-[#222] pt-8 text-center text-[14px] min-[768px]:mt-16 min-[992px]:mt-16 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-between min-[992px]:gap-4 min-[992px]:text-left">
          <p className="text-[#ffffffb3]">
            {(settings.copyright || "© 2023 Sophea Naildesign. All rights reserved.")
              .split(/(Sophea Naildesign)/i)
              .map((part, i) =>
                /Sophea Naildesign/i.test(part) ? (
                  <a
                    key={i}
                    href={settings.instagram || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline underline-offset-2 transition hover:text-white/80"
                  >
                    {part}
                  </a>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
          </p>
          <p className="text-white">
            Powered by{" "}
            <a
              href="https://www.orbitsystem.ch/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 transition hover:text-white/80"
            >
              Orbitsystem
            </a>
          </p>
          <p className="text-white">
            Design by{" "}
            <a
              href="https://www.orbitsystem.ch/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 transition hover:text-white/80"
            >
              Prom Chan
            </a>
          </p>
          <a
            href="#"
            className="uppercase tracking-wide text-[#ffffffb3] transition hover:text-[#ececec]"
          >
            IMPRESSUM &amp; DATENSCHUTZ
          </a>
        </div>
      </div>
    </footer>
  );
}
