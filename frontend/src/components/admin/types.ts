export type TabId =
  | "overview"
  | "hero"
  | "services"
  | "promotions"
  | "gallery"
  | "hours"
  | "content"
  | "messages"
  | "profile"
  | "settings";

export type ToastState = { type: "success" | "error"; message: string } | null;

export type NotifyFn = (type: "success" | "error", message: string) => void;

export type StatsData = {
  totals: {
    messages: number;
    unread_messages: number;
    read_messages: number;
    services: number;
    categories: number;
    promotions: number;
    hero_slides: number;
    gallery: number;
  };
  messages_last_7_days: { date: string; label: string; count: number }[];
  message_status: { label: string; value: number; color: string }[];
  content_mix: { label: string; value: number }[];
  recent_messages: {
    id: number;
    name: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
  }[];
};

export type ServiceItem = {
  id: number;
  service_category_id?: number;
  name: string;
  price: string | number | null;
  is_from_price: boolean;
  price_prefix?: string | null;
  description?: string | null;
  sort_order: number;
  is_active?: boolean;
};

export type ServiceCategory = {
  id: number;
  name: string;
  subtitle?: string | null;
  slug: string;
  sort_order: number;
  is_active?: boolean;
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
  is_active?: boolean;
  sort_order: number;
};

export type HeroSlide = {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  image_path: string;
  sort_order: number;
  is_active?: boolean;
};

export type GalleryImage = {
  id: number;
  title?: string | null;
  image_path: string;
  alt_text?: string | null;
  sort_order: number;
  is_active?: boolean;
};

export type OpeningHour = {
  id: number;
  day_label: string;
  hours: string;
  sort_order: number;
  is_active?: boolean;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type SiteSettings = Record<string, string>;

export const poppins = {
  fontFamily: "var(--font-poppins), Poppins, sans-serif",
} as const;
