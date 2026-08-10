import Image from "next/image";

/**
 * Literal reproduction of sopheanaildesign.webflow.io's `.preisliste-sec`:
 *  - background: radial-gradient vignette over a fixed nail-polish photo
 *  - a small pink brush-stroke divider (.image.pos-1, 390px wide) above the
 *    price-list graphic itself (which already contains the logo/social/price
 *    content baked in — no extra heading is rendered on the source site).
 */
export function PreislisteSection() {
  return (
    <section
      id="preise"
      className="relative flex flex-col items-center overflow-hidden bg-black pb-[100px] pt-[90px] min-[992px]:pt-[140px]"
      style={{
        backgroundImage:
          "radial-gradient(circle, transparent 0%, rgba(0,0,0,0.49) 73%, #000 100%), url(/images/backgrounds/nail-polish.jpg)",
        backgroundPosition: "0 0, 50%",
        backgroundSize: "auto, cover",
        backgroundAttachment: "scroll, fixed",
      }}
    >
      <Image
        src="/images/brand/brush.svg"
        alt=""
        width={390}
        height={22}
        className="mb-[10px] h-auto w-[390px] max-w-[90%]"
        unoptimized
      />
      {/* .image-3: full-bleed-ish, but with a deliberate side gap (~3% of viewport) instead of touching the edges */}
      <div className="w-[94%] max-w-[1780px]">
        <Image
          src="/images/preise/preisliste.jpg"
          alt="Preisliste Sophea Naildesign"
          width={1900}
          height={2689}
          sizes="100vw"
          className="h-auto w-full"
          priority={false}
        />
      </div>
    </section>
  );
}
