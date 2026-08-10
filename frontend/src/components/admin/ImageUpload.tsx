"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { mediaUrl, uploadImage } from "./media";
import { inputClass } from "./ui";
import { poppins } from "./types";

type Props = {
  token: string;
  value: string;
  onChange: (path: string) => void;
  folder?: string;
  label?: string;
  /** circular avatar picker */
  variant?: "default" | "avatar";
  /** show raw URL/path field (off by default for a cleaner UI) */
  showPath?: boolean;
  onUnauthorized?: () => void;
  onError?: (message: string) => void;
};

export function ImageUpload({
  token,
  value,
  onChange,
  folder = "uploads",
  label = "Bild",
  variant = "default",
  showPath = false,
  onUnauthorized,
  onError,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const preview = mediaUrl(value);

  async function onFile(file?: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(token, file, folder);
      onChange(result.path);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload fehlgeschlagen";
      if (msg.toLowerCase().includes("unauth") || msg.includes("401")) {
        onUnauthorized?.();
      }
      onError?.(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => void onFile(e.target.files?.[0])}
    />
  );

  if (variant === "avatar") {
    return (
      <div className="flex flex-col items-center gap-3" style={poppins}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="group relative h-28 w-28 overflow-hidden rounded-full bg-neutral-100 ring-4 ring-white shadow-md shadow-neutral-300/50 transition hover:ring-brand-pink/30 disabled:opacity-60"
          aria-label="Profilbild ändern"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-neutral-300">
              ?
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
            <Camera className="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" />
          </span>
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="h-6 w-6 animate-spin text-brand-pink" />
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-[#151515] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-pink disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Bild ändern"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
            >
              Entfernen
            </button>
          ) : null}
        </div>
        {fileInput}
      </div>
    );
  }

  return (
    <div className="space-y-2" style={poppins}>
      <div className="flex flex-wrap items-start gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-neutral-50 transition hover:border-brand-pink hover:bg-brand-pink/5 disabled:opacity-60"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-neutral-400">
              <ImagePlus className="h-5 w-5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                Upload
              </span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="h-5 w-5 animate-spin text-brand-pink" />
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            {label}
          </p>
          {showPath ? (
            <input
              className={inputClass}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/images/... oder Upload"
            />
          ) : (
            <p className="text-sm text-neutral-500">
              {value
                ? "Bild hochgeladen — Speichern nicht vergessen."
                : "JPG, PNG oder WebP · max. 50 MB"}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-[#151515] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-pink disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Datei wählen"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:border-red-200 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Entfernen
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {fileInput}
    </div>
  );
}
