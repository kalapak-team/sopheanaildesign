import Image from "next/image";
import { Phone } from "lucide-react";
import { Header } from "./Header";

type DarkHeroProps = {
  tagline?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
};

/**
 * Literal structure + values from sopheanaildesign.webflow.io's production
 * CSS/HTML (.header-section > .navbar + .header-container > .header-title-container).
 * Reproduced with the same flex hierarchy and inline styles (not reinterpreted
 * Tailwind utilities) so the browser's own layout algorithm — not a hand-derived
 * approximation — produces an identical result, including the background photo's
 * true bottom-anchored crop (background-position: 50% 100%).
 */
export function DarkHero({
  tagline = "WENN ES UM PERFEKTE NÄGEL GEHT",
  phone = "079 827 94 98",
  facebook = "https://www.facebook.com/SopheaNaildesign",
  instagram = "https://www.instagram.com/sophea_naildesign/",
}: DarkHeroProps) {
  return (
    <section
      id="home"
      className="relative flex h-[clamp(480px,100vh,800px)] flex-col items-center overflow-hidden bg-black pb-[100px] text-white min-[992px]:h-[clamp(600px,100vh,800px)]"
      style={{
        /*
          .header-section's real background stack: a radial vignette + a flat
          dark overlay (both `scroll` attachment, so they simply move with the
          section like normal) layered over the photo, which alone uses
          `background-attachment: fixed` — so the photo stays pinned to the
          viewport while the page scrolls past it, instead of scrolling away
          with the hero section like a regular <img>.
        */
        backgroundImage:
          "radial-gradient(circle, transparent 0%, rgba(0,0,0,0.58) 73%, #000 100%), linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(/images/hero/dark-hero.jpg)",
        backgroundPosition: "0 0, 0 0, 50% 100%",
        backgroundRepeat: "repeat, repeat, no-repeat",
        backgroundSize: "auto, auto, cover",
        backgroundAttachment: "scroll, scroll, fixed",
      }}
    >
      <Header variant="hero" />

      {/* .header-container: fills remaining height below the navbar, .header-title-container centers its content within that space */}
      <div className="relative z-10 flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-3 pb-[50px] text-center min-[992px]:px-6">
        <p
          className="pb-[25px] pl-[6px] uppercase text-white max-[479px]:leading-none min-[480px]:leading-[1.777]"
          style={{
            fontFamily: "var(--font-poppins)",
            fontWeight: 600,
            fontSize: "30px",
            letterSpacing: "6px",
          }}
        >
          {tagline}
        </p>

        <h1
          className="bg-clip-text text-transparent pb-[25px] text-[42px] leading-none min-[480px]:text-[66px] min-[480px]:leading-[0.75] min-[992px]:text-[96px]"
          style={{
            fontFamily: "var(--font-poppins)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-1.5px",
            backgroundImage:
              "linear-gradient(91deg, #fc03a1 0%, #fa009e 19%, #e8cd00 100%)",
          }}
        >
          SOPHEA NAILDESIGN
        </h1>

        {/* .divider-image: rendered at its natural 949px width (like the source <img width="949">), only shrinking below that on narrow viewports */}
        <div className="w-full max-w-[949px] pb-[25px]">
          <Image
            src="/images/brand/brush.svg"
            alt=""
            width={949}
            height={53}
            className="h-auto w-full"
            unoptimized
          />
        </div>

        <div className="flex items-center justify-center">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="mr-5 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 border-white"
            aria-label={`Call ${phone}`}
          >
            <Phone className="h-5 w-5" strokeWidth={2.2} />
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-[32px] text-white min-[480px]:text-[64px]"
            style={{
              fontFamily: "var(--font-open-sans)",
              fontWeight: 700,
            }}
          >
            {phone}
          </a>
        </div>

        <div className="mt-[40px] flex items-center justify-center">
          <a
            href={facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="mr-[10px] h-[50px] w-[50px] overflow-hidden rounded-full transition hover:scale-105"
          >
            <Image
              src="/images/brand/facebook-badge.png"
              alt="Facebook"
              width={50}
              height={50}
              className="h-full w-full object-cover"
            />
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="h-[50px] w-[50px] overflow-hidden rounded-full transition hover:scale-105"
          >
            <Image
              src="/images/brand/instagram-badge.png"
              alt="Instagram"
              width={50}
              height={50}
              className="h-full w-full object-cover"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
