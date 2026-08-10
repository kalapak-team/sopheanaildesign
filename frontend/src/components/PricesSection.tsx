import type { OpeningHour, ServiceCategory } from "@/lib/api";
import { formatPrice } from "@/lib/api";

function PriceCard({ category }: { category: ServiceCategory }) {
  return (
    <div className="rounded-lg border border-pink-100 bg-white p-5 shadow-sm">
      <h3 className="font-display text-2xl font-bold tracking-tight text-black">
        {category.name}
      </h3>
      {category.subtitle && (
        <p className="mt-1 text-sm text-neutral-600">{category.subtitle}</p>
      )}
      <ul className="mt-4 space-y-1">
        {category.services.map((service) => (
          <li key={service.id} className="price-row text-sm">
            <span className="label">{service.name}</span>
            <span className="amount">
              {formatPrice(service.price, {
                from: service.is_from_price,
                prefix: service.price_prefix,
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricesSection({
  categories,
  openingHours,
  phone,
}: {
  categories: ServiceCategory[];
  openingHours: OpeningHour[];
  phone?: string;
}) {
  const left = categories.filter((_, i) => i % 2 === 0);
  const right = categories.filter((_, i) => i % 2 === 1);

  return (
    <section id="preise" className="bg-brand-pink-light py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2 md:px-8">
        <div className="space-y-6">
          {left.map((cat) => (
            <PriceCard key={cat.id} category={cat} />
          ))}
        </div>
        <div className="space-y-6">
          {right.map((cat) => (
            <PriceCard key={cat.id} category={cat} />
          ))}
          <div className="rounded-lg border border-pink-100 bg-white p-5 shadow-sm">
            <h3 className="font-display text-2xl font-bold">Öffnungszeiten</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {openingHours.map((h) => (
                <li key={h.id} className="flex justify-between gap-4">
                  <span>{h.day_label}</span>
                  <span className="font-medium">{h.hours}</span>
                </li>
              ))}
            </ul>
            {phone && (
              <p className="mt-6 font-display text-xl font-bold tracking-wide">
                Tel: {phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
