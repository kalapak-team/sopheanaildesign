import { API_URL } from "@/lib/api";
export { mediaUrl } from "@/lib/media";

// keep under laravel's upload limit
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export async function uploadImage(
  token: string,
  file: File,
  folder = "uploads"
): Promise<{ path: string; url: string }> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Datei zu gross (${(file.size / 1024 / 1024).toFixed(1)} MB). Max. 50 MB.`
    );
  }

  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  const res = await fetch(`${API_URL}/admin/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body,
  });

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error(
        "Datei zu gross für den Server (413). Bitte kleineres Bild wählen (unter 50 MB)."
      );
    }

    const err = await res.json().catch(() => null);
    const fieldMsg =
      err?.errors?.file?.[0] ||
      err?.errors?.folder?.[0] ||
      (typeof err?.message === "string" ? err.message : null);

    throw new Error(fieldMsg || `Upload fehlgeschlagen (${res.status})`);
  }

  return res.json();
}
