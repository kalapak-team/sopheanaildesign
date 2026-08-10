"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/api";

/**
 * Literal reproduction of sopheanaildesign.webflow.io's slider stack:
 *  .section-3        -> bg #030203, flex column
 *  .slider-wrapper    -> 100vw wide, height 100vh, max-height 800px
 *  .slider-subwrapper -> 90% width, max-width 1150px, height 75% (letterboxed)
 *  .left-arrow/.right-arrow -> 70x70 circle, bg #333, 5px white border, ±35px outside the edge
 *  .slide-nav (w-round) -> round pagination dots, invert (white/translucent) style
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length || 1;

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4700);
    return () => clearInterval(id);
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  if (!slides.length) return null;

  return (
    <section className="flex flex-col items-center bg-[#030203] pb-[40px]">
      <div className="relative flex h-[clamp(400px,100vh,800px)] w-screen mt-[20px] items-center justify-center">
        <div className="relative h-[75%] w-[90%] max-w-[1150px]">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image_path}
                alt={slide.title || "Sophea Naildesign"}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="1150px"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={prev}
            className="absolute left-[-35px] top-1/2 flex h-[70px] w-[70px] -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white bg-[#333] text-white transition hover:-translate-x-0.5 hover:-translate-y-1/2"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-[-35px] top-1/2 flex h-[70px] w-[70px] -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white bg-[#333] text-white transition hover:translate-y-[-50%] hover:translate-x-0.5"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* .slide-nav.w-round.w-slider-nav-invert: round dots, sitting below the image (not overlapping it) */}
          <div className="absolute inset-x-0 top-full z-10 mt-[14px] flex items-center justify-center gap-[6px]">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-[9px] w-[9px] rounded-full transition-colors ${
                  i === index ? "bg-[#222]" : "bg-[#2226]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
