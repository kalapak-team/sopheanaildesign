export const EXTERNAL_REL = "noopener noreferrer";

export const siteNav = [
  { href: "#uber-mich", label: "Über Mich" },
  { href: "#dienstleistungen", label: "Dienstleistungen" },
  { href: "#Aktionen", label: "Aktionen" },
  { href: "#preise", label: "Preise" },
  { href: "#kontakt", label: "Kontakt" },
] as const;

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function mapsHref(...parts: Array<string | undefined>) {
  const query = parts.filter(Boolean).join(", ");
  if (!query) return "#";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
