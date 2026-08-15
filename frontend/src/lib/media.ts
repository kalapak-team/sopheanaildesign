import { API_URL } from "@/lib/api";

// /storage/... comes from laravel — prefix the API host
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/storage/")) {
    const base = API_URL.replace(/\/api\/?$/, "");
    return `${base}${path}`;
  }
  return path;
}

export function settingImage(
  settings: Record<string, string> | undefined,
  key: string,
  fallback: string
): string {
  return mediaUrl(settings?.[key]) || fallback;
}

// next/image can't optimize svg / random remote hosts
export function shouldUnoptimize(src: string) {
  return (
    src.endsWith(".svg") ||
    src.includes("/storage/") ||
    src.includes("r2.dev") ||
    /^https?:\/\//i.test(src)
  );
}
