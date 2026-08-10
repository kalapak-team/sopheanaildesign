import Image from "next/image";
import type { OpeningHour, SiteSettings } from "@/lib/api";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Literal reproduction of sopheanaildesign.webflow.io's `.nail-footer`, based
 * on the site's real production CSS:
 *
 *  .nail-footer        { background: #161616; border-top: 1px solid #303030; padding: 5rem 0; }
 *  .container-25       { width: 90%; max-width: 1280px; margin: 0 auto; }
 *  .footer-top-wrapper { display:grid; grid-template-columns: .75fr auto; column-gap: 8vw; }
 *                         -- the LEFT block (logo+phone) grows to fill the remaining
 *                            space, the RIGHT block (menu columns) only takes as
 *                            much width as its own content needs.
 *  .footer-left-wrapper{ max-width: 32rem; }
 *  .footer-menu-wrapper{ display:grid; grid-template-columns: 1fr 1fr .25fr; column-gap: 2rem; }
 *  .footer-block-subtitle { font-size: 2.5rem; } (35px <992px) -- the phone number.
 *  .footer-link-list-heading { font-size: .875rem; font-weight:600; color:#ececec; }
 *  .footer-link         { font-weight:600; color:#ffffffb3; }
 *  .bottom-block        { border-top:1px solid #ffffff1a; font-size:11px; }
 */
export function Footer({
  settings,
  openingHours,
}: {
  settings: SiteSettings;
  openingHours: OpeningHour[];
}) {
  return (
    <footer
      id="kontakt"
      className="border-t border-[#303030] bg-[#161616] text-white"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="mx-auto w-[90%] max-w-[1280px] py-24 min-[992px]:py-36">
        <div className="grid grid-cols-1 gap-y-12 min-[992px]:grid-cols-[0.75fr_auto] min-[992px]:items-start min-[992px]:gap-x-[8vw] min-[992px]:gap-y-4">
          <div className="flex max-w-[32rem] flex-col items-start">
            {/*
              .footer-left-wrapper > .logo-link > img.logo-logotype: the source
              site bakes the cursive "sn!" mark, "Sophea Naildesign" wordmark
              and its gradient underline into ONE PNG asset — not separate
              live text — so it's reproduced here as a single image too.
            */}
            <Image
              src="/images/brand/logo-footer.png"
              alt="Sophea Naildesign"
              width={632}
              height={256}
              className="mb-8 h-auto w-full"
            />
            <a
              href={`tel:${settings.phone_intl || settings.phone}`}
              className="mt-5 block whitespace-nowrap text-[35px] font-bold text-white min-[992px]:text-[40px]"
            >
              {settings.phone_intl || settings.phone}
            </a>
          </div>

          <div className="-mt-3 grid grid-cols-1 gap-y-10 min-[480px]:grid-cols-[1fr_1fr_0.25fr] min-[480px]:gap-x-6 min-[992px]:gap-x-8">
            <div className="flex flex-col items-start text-left">
              <h3 className="mb-4 text-sm font-semibold text-[#ececec]">Öffnungszeiten</h3>
              <ul className="space-y-2 text-sm font-semibold text-white/70">
                {openingHours.map((h) => (
                  <li key={h.id}>
                    <strong className="text-white/90">{h.day_label}</strong>- {h.hours}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start text-left">
              <h3 className="mb-4 text-sm font-semibold text-[#ececec]">Standort</h3>
              <div className="flex flex-col text-sm font-semibold text-white/70">
                <span className="py-2">{settings.address_line1}</span>
                <span className="py-2">{settings.address_line2}</span>
                <a href="#home" className="py-2 hover:text-brand-pink">
                  HOME
                </a>
                <a href="#dienstleistungen" className="flex items-center gap-2 py-2 hover:text-brand-pink">
                  DIENSTLEISTUNGEN
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
                    New
                  </span>
                </a>
                <a href="#preise" className="py-2 hover:text-brand-pink">
                  PREISE
                </a>
              </div>
            </div>

            <div className="flex flex-col items-start text-left">
              <h3 className="mb-4 text-sm font-semibold text-[#ececec]">Social</h3>
              <div className="flex flex-col">
                <a
                  href={settings.facebook || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center py-2 text-white/70 hover:text-[#ececec]"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={settings.instagram || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center py-2 text-white/70 hover:text-[#ececec]"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11px] text-white/40 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-between">
          <p>{settings.copyright}</p>
          <p>Powered by Orbitsystem · Design by Prom Chan</p>
          <a href="#" className="uppercase tracking-wide hover:text-white">
            IMPRESSUM &amp; DATENSCHUTZ
          </a>
        </div>
      </div>
    </footer>
  );
}
