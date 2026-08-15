import Image from "next/image";
import type { SiteSettings } from "@/lib/api";
import { settingImage, shouldUnoptimize } from "@/lib/media";

export function PreislisteSection({ settings }: { settings?: SiteSettings }) {
  const bg = settingImage(
    settings,
    "preisliste_bg_image",
    "/images/backgrounds/nail-polish.jpg"
  );
  const list = settingImage(
    settings,
    "preisliste_image",
    "/images/preise/preisliste.jpg"
  );

  return (
    <section
      id="preise"
      className="relative flex flex-col items-center overflow-hidden bg-black pb-[180px] min-[992px]:pb-[200px]"
      style={{
        backgroundImage: `radial-gradient(circle, transparent 0%, rgba(0,0,0,0.62) 73%, #000 100%), linear-gradient(rgba(0,0,0,0.52), rgba(0,0,0,0.52)), url(${bg})`,
        backgroundPosition: "0 0, 0 0, 50%",
        backgroundSize: "auto, auto, cover",
        backgroundAttachment: "scroll, scroll, fixed",
      }}
    >
      <div className="flex w-full flex-col items-center justify-center py-[80px] min-[992px]:py-[120px]">
        <Image
          src="/images/brand/brush.svg"
          alt=""
          width={390}
          height={22}
          className="h-auto w-[390px] max-w-[90%]"
          unoptimized
        />
      </div>
      <div className="w-[94%] max-w-[1780px]">
        <Image
          src={list}
          alt="Preisliste Sophea Naildesign"
          width={1900}
          height={2689}
          sizes="100vw"
          className="h-auto w-full"
          priority={false}
          unoptimized={shouldUnoptimize(list)}
        />
      </div>
    </section>
  );
}
