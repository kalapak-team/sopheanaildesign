import Image from "next/image";
import type { SiteSettings } from "@/lib/api";

/**
 * Literal reproduction of sopheanaildesign.webflow.io's about section, based on
 * the site's real production CSS:
 *
 *  .about-container    { flex-direction: row; justify-content: space-between; align-items: center; max-width: 1280px; }
 *  .about-text-container { width: 100%; height: 600px; padding: 50px 25px 25px; border-radius: 20px; box-shadow: 0 15px 50px -15px #000; }
 *  .section-image-container { position: relative; display:flex; justify-content:center; align-items:center;
 *                              min-width: 30%; margin: 0 25px; padding: 20px; } (hidden below 992px)
 *  .image-corner-top    { position:absolute; top:0; left:0;   width:50%; height:50%; background: #fc03a1; z-index:0; }
 *  .image-corner-bottom { position:absolute; bottom:0; right:0; width:25%; height:25%; background: #fc03a1; }
 *  .section-image       { width:100%; position:static; }  -- an in-flow (non-positioned) image is painted
 *                                                             BEFORE the absolutely-positioned corner divs, so the
 *                                                             pink corners visibly sit on top of the photo's
 *                                                             top-left / bottom-right corners, not hidden behind it.
 */
export function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="uber-mich" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 min-[992px]:px-0">
        <h2 className="text-center text-2xl font-extrabold uppercase tracking-[0.12em] text-black md:text-3xl">
          WARUM SOPHEA NAILDESIGN
        </h2>
        {/* .about-section > .image: brush-stroke divider, width="211" on the source site */}
        <Image
          src="/images/brand/brush.svg"
          alt=""
          width={211}
          height={12}
          className="mx-auto mt-3 h-auto w-[211px]"
          unoptimized
        />

        <div className="mx-auto mt-12 flex w-full flex-col gap-6 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-between min-[992px]:gap-0">
          <article className="flex w-full flex-col items-center justify-center rounded-[20px] bg-white p-6 pt-[50px] text-center shadow-[0_15px_50px_-15px_rgba(0,0,0,1)] animate-fade-up min-[992px]:h-[600px] min-[992px]:flex-1 min-[992px]:px-[25px] min-[992px]:pb-[25px]">
            <h3 className="text-lg font-bold uppercase">
              WARUM <span className="text-brand-pink">SOPHEA NAILDESIGN</span>
            </h3>
            <p className="mt-3 font-semibold">{settings.about_subtitle}</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
              {settings.about_body}
            </p>
          </article>

          {/* .section-image-container: visible only on desktop (>=992px) */}
          <div className="relative hidden shrink-0 items-center justify-center p-5 animate-fade-up animate-delay-1 min-[992px]:flex min-[992px]:w-[413px] min-[992px]:mx-[25px]">
            <div className="absolute left-0 top-0 z-0 h-1/2 w-1/2 rounded-[20px] bg-brand-pink shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]" />
            <div className="absolute bottom-0 right-0 z-0 h-1/4 w-1/4 rounded-[20px] bg-brand-pink shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]" />
            <Image
              src="/images/about/portrait.jpg"
              alt="Sophea Naildesign"
              width={2000}
              height={1500}
              sizes="380px"
              className="relative z-[1] w-full rounded-[20px] shadow-[0_25px_50px_-25px_rgba(0,0,0,1)]"
            />
          </div>

          <article className="flex w-full flex-col items-center justify-center rounded-[20px] bg-white p-6 pt-[50px] text-center shadow-[0_15px_50px_-15px_rgba(0,0,0,1)] animate-fade-up animate-delay-2 min-[992px]:h-[600px] min-[992px]:flex-1 min-[992px]:px-[25px] min-[992px]:pb-[25px]">
            <h3 className="text-lg font-bold uppercase">
              ÜBER <span className="text-brand-pink">MICH</span>
            </h3>
            <p className="mt-3 font-semibold">{settings.about_me_subtitle}</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
              {settings.about_me_body}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
