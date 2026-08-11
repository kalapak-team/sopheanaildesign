import type { StatsData } from "./types";

const STATS_KEY = "admin_stats_cache_v1";

function isStatsShape(value: unknown): value is StatsData {
  if (!value || typeof value !== "object") return false;
  const data = value as StatsData;
  return Boolean(data.totals && typeof data.totals === "object");
}

export function readCachedStats(): StatsData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isStatsShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCachedStats(stats: StatsData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    /* quota / private mode */
  }
}

export function clearCachedStats(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STATS_KEY);
  } catch {
    /* ignore */
  }
}
