import Image from "next/image";
import type { SiteSettings } from "@/lib/api";
import { settingImage } from "@/lib/media";

/**
 * Dienstleistungen banner — salon photo background + pink title + brush.
 * Mobile matches Webflow: title/brush only over the photo (nail card hidden).
 * Desktop also shows the centered nail image with pink corner accents.
 * (Avoid background-attachment:fixed — broken on iOS.)
 */
export function ServicesHero({ settings }: { settings?: SiteSettings }) {
  const bg = settingImage(
    settings,
    "services_bg_image",
    "/images/services/nail-studio-bg.jpg"
  );
  const nail = settingImage(
    settings,
    "services_nail_image",
    "/images/services/nagel-1.jpg"
  );
  const remoteBg = bg.includes("/storage/") || bg.includes("r2.dev");

  return (
    <section
      id="dienstleistungen"
      className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden py-[90px] min-[768px]:min-h-[360px] min-[768px]:py-[100px] min-[992px]:min-h-screen min-[992px]:py-[180px]"
    >
      <Image
        src={bg}
        alt=""
        fill
        priority
        sizes="100vw"
        unoptimized={remoteBg}
        className="pointer-events-none object-cover object-center"
        aria-hidden
      />

      <div className="relative z-[1] flex flex-col items-center">
        <h3
          className="bg-clip-text pb-[25px] text-center text-[30px] font-bold uppercase leading-[75%] text-transparent min-[992px]:text-[48px]"
          style={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            backgroundImage:
              "linear-gradient(97deg, #ff06a4, #db1568 20%, #ff006a 31%, #ff0079 46%, #ff2be3)",
          }}
        >
          {settings?.services_heading || "Dienstleistungen"}
        </h3>
        <Image
          src="/images/brand/brush.svg"
          alt=""
          width={282}
          height={16}
          className="h-auto w-[220px] max-w-[80%] min-[992px]:w-[282px]"
          unoptimized
        />

        {/* Nail card: desktop only — mobile matches reference (title + brush on BG) */}
        <div className="relative mt-8 hidden w-[384px] max-w-[85%] p-5 min-[992px]:block">
          <div className="absolute right-0 top-0 z-0 h-1/2 w-1/2 rounded-[20px] bg-brand-pink shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]" />
          <div className="absolute bottom-0 left-0 z-0 h-1/4 w-1/4 rounded-[20px] bg-brand-pink shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]" />
          <Image
            src={nail}
            alt="Dienstleistungen"
            width={800}
            height={600}
            sizes="384px"
            unoptimized={nail.includes("/storage/") || nail.includes("r2.dev")}
            className="relative z-[1] w-full rounded-[20px] shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]"
          />
        </div>
      </div>
    </section>
  );
}
