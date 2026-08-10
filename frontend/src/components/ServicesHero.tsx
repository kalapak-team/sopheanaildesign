import Image from "next/image";

/**
 * Literal reproduction of sopheanaildesign.webflow.io's `.classes-section`
 * ("Dienstleistungen"), based on the site's real production CSS/HTML:
 *
 *  .classes-section { background: url(NailStudio.jpg) center/cover fixed; padding: 100px 0 90px; }
 *  h3.heading.head-text-1 { font-size: 48px; text-transform: uppercase; padding-bottom: 25px;
 *                            gradient text-fill (pink/magenta), background-clip: text; }
 *  .classes-container { flex-row, justify-content: space-between; two empty spacer divs around the
 *                        image, which resolves to the image container being perfectly centered. }
 *  .section-image-container { position: relative; padding: 20px; min-width: 30% (=384px @1280 container). }
 *  .image-corner-top-classes    { top:0; right:0;  width:50%; height:50%; background:#fc03a1; } (mirrored vs. About section)
 *  .image-corner-bottom-classes { bottom:0; left:0; width:25%; height:25%; background:#fc03a1; }
 *  .section-image { width:100%; position:static; } -- painted UNDER the pink corners (they show on top).
 */
export function ServicesHero() {
  return (
    <section
      id="dienstleistungen"
      className="flex flex-col items-center bg-cover bg-center bg-no-repeat bg-fixed py-[100px] pb-[90px]"
      style={{ backgroundImage: "url(/images/services/nail-studio-bg.jpg)" }}
    >
      <h3
        className="bg-clip-text pb-[25px] text-[30px] font-bold uppercase leading-[75%] text-transparent min-[992px]:text-[48px]"
        style={{
          backgroundImage:
            "linear-gradient(97deg, #ff06a4, #db1568 20%, #ff006a 31%, #ff0079 46%, #ff2be3)",
        }}
      >
        Dienstleistungen
      </h3>
      <Image
        src="/images/brand/brush.svg"
        alt=""
        width={282}
        height={16}
        className="h-auto w-[282px] max-w-[80%]"
        unoptimized
      />

      <div className="relative mt-8 w-[384px] max-w-[85%] p-5">
        <div className="absolute right-0 top-0 z-0 h-1/2 w-1/2 rounded-[20px] bg-brand-pink shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]" />
        <div className="absolute bottom-0 left-0 z-0 h-1/4 w-1/4 rounded-[20px] bg-brand-pink shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]" />
        <Image
          src="/images/services/nagel-1.jpg"
          alt="Dienstleistungen"
          width={800}
          height={600}
          sizes="384px"
          className="relative z-[1] w-full rounded-[20px] shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]"
        />
      </div>
    </section>
  );
}
