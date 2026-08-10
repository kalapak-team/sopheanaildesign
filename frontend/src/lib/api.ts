export type SiteSettings = Record<string, string>;

export type ServiceItem = {
  id: number;
  name: string;
  price: string | number | null;
  is_from_price: boolean;
  price_prefix?: string | null;
  description?: string | null;
  sort_order: number;
};

export type ServiceCategory = {
  id: number;
  name: string;
  subtitle?: string | null;
  slug: string;
  sort_order: number;
  services: ServiceItem[];
};

export type Promotion = {
  id: number;
  title: string;
  highlight?: string | null;
  price: string | number;
  currency: string;
  description?: string | null;
  image_path?: string | null;
  header_style: "dark" | "pink";
  is_featured: boolean;
  sort_order: number;
};

export type HeroSlide = {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  image_path: string;
  sort_order: number;
};

export type GalleryImage = {
  id: number;
  title?: string | null;
  image_path: string;
  alt_text?: string | null;
  sort_order: number;
};

export type OpeningHour = {
  id: number;
  day_label: string;
  hours: string;
  sort_order: number;
};

export type SiteData = {
  settings: SiteSettings;
  hero_slides: HeroSlide[];
  categories: ServiceCategory[];
  promotions: Promotion[];
  gallery: GalleryImage[];
  opening_hours: OpeningHour[];
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export async function fetchSiteData(): Promise<SiteData | null> {
  try {
    const res = await fetch(`${API_URL}/site`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function formatPrice(
  price: string | number | null | undefined,
  opts?: { from?: boolean; prefix?: string | null; currency?: string }
) {
  if (price === null || price === undefined || price === "") return "";
  const value = Number(price).toFixed(2);
  const currency = opts?.currency ?? "CHF";
  const from = opts?.from ? "ab " : "";
  const prefix = opts?.prefix ? `${opts.prefix} ` : "";
  return `${prefix}${from}${currency} ${value}`;
}
