import Image from "next/image";
import { Phone } from "lucide-react";
import { Header } from "./Header";
import { settingImage } from "@/lib/media";
import { EXTERNAL_REL, telHref } from "@/lib/site";
import type { SiteSettings } from "@/lib/api";

type DarkHeroProps = {
  tagline?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
  settings?: SiteSettings;
};

export function DarkHero({
  tagline = "WENN ES UM PERFEKTE NÄGEL GEHT",
  phone = "079 827 94 98",
  facebook = "https://www.facebook.com/SopheaNaildesign",
  instagram = "https://www.instagram.com/sophea_naildesign/",
  settings,
}: DarkHeroProps) {
  const bg = settingImage(settings, "dark_hero_image", "/images/hero/dark-hero.jpg");
  return (
    <section
      id="home"
      className="relative flex h-[clamp(480px,100vh,800px)] flex-col items-center overflow-hidden bg-black pb-[100px] text-white min-[992px]:h-[clamp(600px,100vh,800px)]"
      style={{
        // photo stays put; overlays scroll with the section
        backgroundImage: `radial-gradient(circle, transparent 0%, rgba(0,0,0,0.58) 73%, #000 100%), linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${bg})`,
        backgroundPosition: "0 0, 0 0, 50% 100%",
        backgroundRepeat: "repeat, repeat, no-repeat",
        backgroundSize: "auto, auto, cover",
        backgroundAttachment: "scroll, scroll, fixed",
      }}
    >
      <Header />

      <div className="relative z-10 flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-3 pb-[50px] text-center min-[992px]:px-6">
        <p className="hero-pop hero-delay-1 pb-[25px] pl-[6px] text-[30px] font-semibold uppercase tracking-[6px] text-white max-[479px]:leading-none min-[480px]:leading-[1.777]">
          {tagline}
        </p>

        <h1
          className="hero-pop hero-delay-2 bg-clip-text pb-[25px] text-[42px] font-bold uppercase leading-none tracking-[-1.5px] text-transparent min-[480px]:text-[66px] min-[480px]:leading-[0.75] min-[992px]:text-[96px]"
          style={{
            backgroundImage:
              "linear-gradient(91deg, #fc03a1 0%, #fa009e 19%, #e8cd00 100%)",
          }}
        >
          {settings?.hero_brand_name ||
            settings?.business_name ||
            "SOPHEA NAILDESIGN"}
        </h1>

        <div className="hero-pop hero-delay-3 w-full max-w-[949px] pb-[8px]">
          <Image
            src="/images/brand/brush.svg"
            alt=""
            width={949}
            height={53}
            className="h-auto w-full"
            unoptimized
          />
        </div>

        <div className="hero-pop hero-delay-4 -mt-1 flex items-center justify-center">
          <a
            href={telHref(phone)}
            className="mr-5 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 border-white"
            aria-label={`Call ${phone}`}
          >
            <Phone className="h-5 w-5" strokeWidth={2.2} />
          </a>
          <a
            href={telHref(phone)}
            className="font-open-sans text-[32px] font-bold text-white min-[480px]:text-[64px]"
          >
            {phone}
          </a>
        </div>

        <div className="hero-pop hero-delay-5 mt-[28px] flex items-center justify-center">
          <a
            href={facebook}
            target="_blank"
            rel={EXTERNAL_REL}
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
            rel={EXTERNAL_REL}
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
