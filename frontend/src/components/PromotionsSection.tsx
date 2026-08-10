"use client";

import Image from "next/image";
import type { Promotion } from "@/lib/api";
import { mediaUrl } from "@/lib/media";
import { ScrollReveal } from "@/components/ScrollReveal";

type Props = {
  heading?: string;
  promotions?: Promotion[];
};

const fallbackCards: Promotion[] = [
  {
    id: 1,
    title: "Neuset",
    highlight: "Verstärkung",
    price: 69,
    currency: "CHF",
    description:
      "Profitieren Sie Heute noch von den Preisreduktion. Spitzenleistung zu unschlagbaren Preis.",
    image_path: "/images/promotions/nail1.png",
    header_style: "dark",
    is_featured: false,
    sort_order: 1,
  },
  {
    id: 2,
    title: "Water-Pediküre",
    highlight: "ohne Lack",
    price: 69,
    currency: "CHF",
    description:
      "Profitieren Sie Heute noch von den Preisreduktion. Spitzenleistung zu unschlagbaren Preis.",
    image_path: "/images/promotions/pedi1.png",
    header_style: "pink",
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 3,
    title: "Trocken-pediküre",
    highlight: "mit shellac",
    price: 50,
    currency: "CHF",
    description:
      "Profitieren Sie Heute noch von den Preisreduktion. Spitzenleistung zu unschlagbaren Preis.",
    image_path: "/images/promotions/pedi2.png",
    header_style: "dark",
    is_featured: false,
    sort_order: 3,
  },
];

function cardDirection(index: number, total: number): "left" | "right" | "up" {
  if (total === 1) return "up";
  if (index === 0) return "left";
  if (index === total - 1) return "right";
  return "up";
}

export function PromotionsSection({
  heading = "Preis reduktion nur für kurze Zeit!",
  promotions,
}: Props) {
  const cards = promotions?.length ? promotions : fallbackCards;

  return (
    <section
      id="Aktionen"
      className="flex flex-col items-center overflow-x-clip bg-white px-[10px] pb-[90px] pt-[140px] min-[480px]:px-[12.5px] min-[992px]:px-0 min-[992px]:pb-[100px] min-[992px]:pt-[160px]"
      style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
    >
      <ScrollReveal direction="pop">
        <h3 className="mb-[90px] px-2 text-center text-[32px] font-bold uppercase leading-[1.35] text-black min-[480px]:text-[36px] min-[992px]:mb-[100px] min-[992px]:text-[48px] min-[992px]:leading-[1.1]">
          {heading}
        </h3>
      </ScrollReveal>

      <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-y-[10px] min-[992px]:flex-nowrap">
        {cards.map((card, i) => {
          const price = String(Math.round(Number(card.price)));
          const dark = card.header_style !== "pink";
          const src = card.image_path ? mediaUrl(card.image_path) : "";
          return (
            <ScrollReveal
              key={card.id}
              direction={cardDirection(i, cards.length)}
              delayMs={i * 120}
              className="w-full min-[480px]:w-[49.25%] min-[992px]:w-[31.9%]"
            >
              <div className="flex w-full flex-col items-center justify-start rounded-[5px] bg-white pb-[50px] shadow-[0_15px_50px_-15px_#000]">
                <h1
                  className={`flex w-full items-baseline justify-center gap-2 rounded-t-[5px] pb-[50px] pt-[50px] text-[42px] font-bold leading-[75%] tracking-[-1.5px] text-white min-[480px]:text-[96px] ${
                    dark ? "bg-[#151515]" : "bg-brand-pink"
                  }`}
                >
                  <span className="text-[40px]">{card.currency || "CHF"}</span>
                  <span>{price}</span>
                </h1>
                <div className="flex w-full flex-col items-center justify-center px-[25px]">
                  <h5 className="pb-[25px] pt-[40px] text-center text-[20px] font-semibold uppercase leading-[130%] text-black">
                    {card.title}{" "}
                    {card.highlight ? (
                      <span className="text-brand-pink">{card.highlight}</span>
                    ) : null}
                  </h5>
                  <p className="pb-[25px] text-center text-sm font-normal leading-[175%] tracking-[0.25px] text-[#151515]">
                    {card.description ||
                      "Profitieren Sie Heute noch von den Preisreduktion. Spitzenleistung zu unschlagbaren Preis."}
                  </p>
                </div>
                {src ? (
                  <Image
                    src={src}
                    alt={card.title}
                    width={266}
                    height={266}
                    className="h-auto w-[266px] max-w-[85%]"
                    unoptimized={
                      src.includes("/storage/") || src.includes("r2.dev")
                    }
                  />
                ) : null}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
