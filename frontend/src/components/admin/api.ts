import { API_URL } from "@/lib/api";

type AdminFetchOptions = RequestInit & {
  json?: unknown;
};

export async function adminFetch(
  path: string,
  token: string,
  options: AdminFetchOptions = {}
): Promise<Response> {
  const { json, headers: extraHeaders, ...rest } = options;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  let body = rest.body;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  return fetch(`${API_URL}/admin${path}`, {
    ...rest,
    headers,
    body,
  });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
