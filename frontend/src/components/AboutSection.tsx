"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/api";
import { settingImage } from "@/lib/media";
import { ScrollReveal } from "@/components/ScrollReveal";

/**
 * `.about-section` cards match sopheanaildesign.webflow.io:
 *  h5 title        — Poppins 20px / 600 / uppercase / lh 75% / pb 25px
 *  .paragraph-bold — 14px / 600 / lh 175% / pb 12.5px
 *  body p          — Poppins 14px / lh 175% / tracking .25px / pb 25px / #151515
 */
function AboutCard({
  title,
  subtitle,
  body,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  body: string;
}) {
  return (
    <article className="flex w-full flex-col items-center justify-center rounded-[20px] bg-white px-[25px] py-[40px] text-center shadow-[0_15px_50px_-15px_rgba(0,0,0,1)] min-[992px]:h-[600px] min-[992px]:w-[400px] min-[992px]:max-w-[400px] min-[992px]:shrink-0 min-[992px]:px-[28px] min-[992px]:py-[45px]">
      <h5
        className="pb-[25px] text-[22px] font-semibold uppercase leading-[75%] text-black"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {title}
      </h5>
      <p
        className="pb-[12.5px] text-[14px] font-semibold leading-[175%] text-[#151515]"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {subtitle}
      </p>
      <p
        className="whitespace-pre-line pb-[25px] text-[14px] font-normal leading-[175%] tracking-[0.25px] text-[#151515]"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {body}
      </p>
    </article>
  );
}

export function AboutSection({ settings }: { settings: SiteSettings }) {
  const portrait = settingImage(
    settings,
    "about_portrait_image",
    "/images/about/portrait.jpg"
  );

  return (
    <section
      id="uber-mich"
      className="flex flex-col items-center overflow-x-clip bg-white px-[10px] py-[90px] min-[480px]:px-[12.5px] min-[992px]:px-0 min-[992px]:py-[100px]"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center">
        <ScrollReveal direction="up">
          <h2
            className="pb-[90px] text-center text-[32px] font-bold uppercase leading-[75%] text-black min-[992px]:text-[48px]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            WARUM SOPHEA NAILDESIGN
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="up" delayMs={80}>
          <Image
            src="/images/brand/brush.svg"
            alt=""
            width={211}
            height={12}
            className="mx-auto h-auto w-[211px]"
            unoptimized
          />
        </ScrollReveal>

        <div className="mx-auto mt-12 flex w-full flex-col items-center gap-6 min-[992px]:flex-row min-[992px]:items-center min-[992px]:justify-center min-[992px]:gap-6">
          <ScrollReveal direction="left" className="w-full min-[992px]:w-auto">
            <AboutCard
              title={
                <>
                  WARUM <span className="text-brand-pink">SOPHEA NAILDESIGN</span>
                </>
              }
              subtitle={
                settings.about_subtitle ===
                "Gepflegte Hände stehen im Mittelpunkt" ? (
                  <>
                    Gepflegte Hände
                    <br />
                    stehen im Mittelpunkt
                  </>
                ) : (
                  settings.about_subtitle
                )
              }
              body={settings.about_body}
            />
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delayMs={120}
            className="relative hidden shrink-0 items-center justify-center p-5 min-[992px]:flex min-[992px]:w-[430px]"
          >
            <div className="absolute left-0 top-0 h-1/2 w-1/2 rounded-[20px] bg-brand-pink shadow-[0_25px_50px_-25px_#000]" />
            <div className="absolute bottom-0 right-0 h-1/4 w-1/4 rounded-[20px] bg-brand-pink shadow-[0_25px_50px_-25px_#000]" />
            <Image
              src={portrait}
              alt="Sophea Naildesign"
              width={2000}
              height={1500}
              sizes="390px"
              unoptimized={portrait.includes("/storage/") || portrait.includes("r2.dev")}
              className="relative z-[1] w-full rounded-[20px] shadow-[0_25px_50px_-25px_#000]"
            />
          </ScrollReveal>

          <ScrollReveal
            direction="right"
            delayMs={160}
            className="w-full min-[992px]:w-auto"
          >
            <AboutCard
              title={
                <>
                  ÜBER <span className="text-brand-pink">MICH</span>
                </>
              }
              subtitle={settings.about_me_subtitle}
              body={settings.about_me_body}
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
