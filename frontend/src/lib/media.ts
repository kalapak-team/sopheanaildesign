import { API_URL } from "@/lib/api";

/** Turn relative /storage/... or absolute URLs into a browser-usable URL */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/storage/")) {
    const base = API_URL.replace(/\/api\/?$/, "");
    return `${base}${path}`;
  }
  return path;
}

/** Prefer CMS setting image, otherwise static fallback */
export function settingImage(
  settings: Record<string, string> | undefined,
  key: string,
  fallback: string
): string {
  return mediaUrl(settings?.[key]) || fallback;
}
