import Image from "next/image";

/**
 * Literal reproduction of sopheanaildesign.webflow.io's `.pricing-section`
 * ("Preis reduktion nur für kurze Zeit!"), based on the site's real
 * production CSS/HTML:
 *
 *  #Aktionen.pricing-section { padding: 100px 0 (100px >=992px / 90px <992px);
 *                               flex-direction: column; align-items: center; }
 *  h3.heading-3.head-collor-1 { font-size: 48px; text-transform: uppercase;
 *                                color: black; margin: 60px 0; }
 *  .pricing-container { flex-row; justify-content: space-between; max-width: 1280px; }
 *  .pricing-table      { width: 31.9% (>=992px) / 49.25% (480-991px) / 100% (<480px);
 *                        background: #fff; border-radius: 5px; box-shadow: 0 15px 50px -15px #000; }
 *  h1.price            { background: deep-pink (or #151515 for `.dark`); color: #fff;
 *                        border-radius: 5px 5px 0 0; padding: 50px 0; font-size: 96px
 *                        (42px <480px); letter-spacing: -1.5px; } -- the "CHF" span
 *                        itself always stays at 40px, so it reads much smaller than
 *                        the price number next to it.
 *  h5.pricing-heading  { font-size: 20px; text-transform: uppercase; font-weight: 600; }
 *  .btn.w-button       { display: none; } -- the "ORDER NOW" buttons are hidden site-wide.
 */
const pricingCards = [
  {
    key: "neuset",
    price: "69",
    dark: true,
    title: "Neuset",
    highlight: "Verstärkung",
    image: "/images/promotions/nail1.png",
    width: 266,
  },
  {
    key: "water-pedikuere",
    price: "69",
    dark: false,
    title: "Water-Pediküre",
    highlight: "ohne Lack",
    image: "/images/promotions/pedi1.png",
    width: 266,
  },
  {
    key: "trocken-pedikuere",
    price: "50",
    dark: true,
    title: "Trocken-pediküre",
    highlight: "mit shellac",
    image: "/images/promotions/pedi2.png",
    width: 273,
  },
];

export function PromotionsSection() {
  return (
    <section
      id="Aktionen"
      className="flex flex-col items-center bg-white px-[10px] pb-[90px] pt-[100px] min-[480px]:px-[12.5px] min-[992px]:px-0 min-[992px]:pb-[100px]"
    >
      <h3
        className="mb-[60px] text-center text-[32px] font-bold uppercase leading-[75%] text-black min-[992px]:text-[48px]"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Preis reduktion nur für kurze Zeit!
      </h3>

      <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-y-[10px] min-[992px]:flex-nowrap">
        {pricingCards.map((card) => (
          <div
            key={card.key}
            className="flex w-full flex-col items-center justify-start rounded-[5px] bg-white pb-[50px] shadow-[0_15px_50px_-15px_#000] min-[480px]:w-[49.25%] min-[992px]:w-[31.9%]"
          >
            <h1
              className={`flex w-full items-baseline justify-center gap-2 rounded-t-[5px] pb-[50px] pt-[50px] text-[42px] font-bold leading-[75%] tracking-[-1.5px] text-white min-[480px]:text-[96px] ${
                card.dark ? "bg-[#151515]" : "bg-brand-pink"
              }`}
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {/*
                IMPORTANT: the price number is the h1's own direct text (not a
                separate sized span) so that `leading-[75%]` — a *percentage*
                line-height — resolves against the h1's real font-size and
                that absolute px value is what gets inherited by the "CHF"
                span. If the number lived in its own `text-[96px]` span
                instead, the h1 would keep its default (tiny) font-size, its
                75% line-height would collapse to a few pixels, and the
                digits would visually spill out of the price box into the
                heading below it.
              */}
              <span className="text-[40px]">CHF</span>
              <span>{card.price}</span>
            </h1>
            <div className="flex w-full flex-col items-center justify-center px-[25px]">
              <h5
                className="pb-[25px] pt-[40px] text-center text-[20px] font-semibold uppercase leading-[130%] text-black"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {card.title} <span className="text-brand-pink">{card.highlight}</span>
              </h5>
              <p
                className="pb-[25px] text-center text-sm font-normal leading-[175%] tracking-[0.25px] text-[#151515]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Profitieren Sie Heute noch von den Preisreduktion. Spitzenleistung zu
                unschlagbaren Preis.
              </p>
            </div>
            <Image
              src={card.image}
              alt={card.title}
              width={card.width}
              height={card.width}
              className="h-auto w-[266px] max-w-[85%]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
