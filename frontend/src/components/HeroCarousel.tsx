"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/api";
import { mediaUrl } from "@/lib/media";

/**
 * Desktop: arrows sit outside left/right of the image (Webflow layout).
 * Mobile: image first, then arrows below, then pagination dots
 * (matches sopheanaildesign.webflow.io mobile).
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

  const arrowBtn =
    "flex h-[52px] w-[52px] items-center justify-center rounded-full border-[4px] border-white bg-[#333] text-white transition active:scale-95 min-[992px]:h-[70px] min-[992px]:w-[70px] min-[992px]:border-[5px]";

  return (
    <section className="flex flex-col items-center bg-[#030203] pb-[40px]">
      <div className="relative mt-[20px] flex w-screen flex-col items-center min-[992px]:h-[clamp(400px,100vh,800px)] min-[992px]:justify-center">
        {/* Image frame */}
        <div className="relative aspect-[3/4] w-[90%] max-w-[1150px] min-[768px]:aspect-[4/5] min-[992px]:aspect-auto min-[992px]:h-[75%]">
          {slides.map((slide, i) => {
            const src = mediaUrl(slide.image_path);
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={src}
                  alt={slide.title || "Sophea Naildesign"}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="(max-width:991px) 90vw, 1150px"
                  unoptimized={
                    src.includes("/storage/") || src.includes("r2.dev")
                  }
                />
              </div>
            );
          })}

          {/* Desktop-only side arrows */}
          <button
            type="button"
            onClick={prev}
            className={`absolute left-[-35px] top-1/2 z-10 hidden -translate-y-1/2 hover:-translate-x-0.5 min-[992px]:flex ${arrowBtn}`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className={`absolute right-[-35px] top-1/2 z-10 hidden -translate-y-1/2 hover:translate-x-0.5 min-[992px]:flex ${arrowBtn}`}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile: arrows under the image, then dots */}
        <div className="mt-3 flex w-[90%] max-w-[1150px] flex-col items-center gap-6 min-[992px]:mt-[14px] min-[992px]:gap-[6px]">
          <div className="flex w-full max-w-[320px] items-center justify-between min-[480px]:max-w-[380px] min-[992px]:hidden">
            <button
              type="button"
              onClick={prev}
              className={arrowBtn}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className={arrowBtn}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-[8px]">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-[9px] w-[9px] rounded-full transition-colors ${
                  i === index ? "bg-[#ddd]" : "bg-[#555]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
