"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/api";

const ELF_SIGHT_APP_ID = "6977d479-4143-42d0-bcb8-2d139541316a";

/**
 * Elfsight dashboard has mobile at 1×1. Patch boot settings so mobile
 * shows 2×2 (4 images) and desktop keeps 4×2 — same style, layout only.
 */
function patchElfsightBootPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  const root = payload as {
    data?: {
      widgets?: Record<
        string,
        {
          data?: {
            settings?: {
              columnsMode?: string;
              columns?: number;
              rows?: number;
              gutter?: number | string;
              responsive?: Array<{
                id?: string;
                minWidth?: number;
                columns?: number;
                rows?: number;
                gutter?: number | string;
              }>;
            };
          };
        }
      >;
    };
  };

  const settings = root.data?.widgets?.[ELF_SIGHT_APP_ID]?.data?.settings;
  if (!settings) return payload;

  // Manual mode required — auto mode ignores responsive breakpoints.
  // Elfsight picks the first breakpoint where innerWidth <= minWidth.
  settings.columnsMode = "manual";
  settings.columns = 4;
  settings.rows = 2;
  settings.gutter = 0;
  settings.responsive = [
    { id: "mobile-4", minWidth: 767, columns: 2, rows: 2, gutter: 0 },
  ];

  return payload;
}

function installElfsightLayoutPatch() {
  const flag = "__sopheaElfsightLayoutPatch";
  if ((window as Window & { [flag]?: boolean })[flag]) return;
  (window as Window & { [flag]?: boolean })[flag] = true;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const response = await originalFetch(...args);
    const url =
      typeof args[0] === "string"
        ? args[0]
        : args[0] instanceof Request
          ? args[0].url
          : String(args[0]);

    if (!url.includes("elfsight.com") || !url.includes("/p/boot")) {
      return response;
    }

    try {
      const data = patchElfsightBootPayload(await response.clone().json());
      return new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch {
      return response;
    }
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    ...rest: unknown[]
  ) {
    (this as XMLHttpRequest & { __elfBootUrl?: string }).__elfBootUrl =
      String(url);
    return originalOpen.apply(this, [method, url, ...rest] as never);
  };

  XMLHttpRequest.prototype.send = function (
    body?: Document | XMLHttpRequestBodyInit | null
  ) {
    const bootUrl = (this as XMLHttpRequest & { __elfBootUrl?: string })
      .__elfBootUrl;
    if (
      bootUrl?.includes("elfsight.com") &&
      bootUrl.includes("/p/boot")
    ) {
      this.addEventListener("readystatechange", function onReady() {
        if (this.readyState !== 4 || !this.responseText) return;
        this.removeEventListener("readystatechange", onReady);
        try {
          const patched = patchElfsightBootPayload(JSON.parse(this.responseText));
          Object.defineProperty(this, "responseText", {
            configurable: true,
            get: () => JSON.stringify(patched),
          });
          Object.defineProperty(this, "response", {
            configurable: true,
            get: () => JSON.stringify(patched),
          });
        } catch {
          /* keep original response */
        }
      });
    }
    return originalSend.call(this, body);
  };
}

/**
 * Instagram section — Elfsight feed (same widget id as the Webflow site),
 * with a local fallback if Elfsight is temporarily unavailable.
 */
export function InstagramSection({ settings }: { settings: SiteSettings }) {
  const [showFallback, setShowFallback] = useState(false);
  const [patchReady, setPatchReady] = useState(false);
  const instagramUrl =
    settings.instagram || "https://www.instagram.com/sopheanaildesign/";

  useEffect(() => {
    installElfsightLayoutPatch();
    setPatchReady(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const root = document.querySelector(`.elfsight-app-${ELF_SIGHT_APP_ID}`);
      // Elfsight injects iframes/widgets; if still empty or shows error text, fall back
      const text = root?.textContent?.toLowerCase() ?? "";
      const hasWidget = Boolean(
        root?.querySelector("iframe, [class*='Widget'], [class*='eapps']")
      );
      const hasError =
        text.includes("temporarily unavailable") ||
        text.includes("support@elfsight.com");

      if (!hasWidget || hasError) {
        setShowFallback(true);
      }
    }, 6000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="py-[60px] min-[768px]:py-[100px]">
      <div className="mx-auto w-[80%] max-w-[1200px]">
        <h1
          className="mx-auto mb-16 w-[80%] max-w-[1151px] text-center text-[32px] font-bold uppercase leading-none tracking-[-1.5px] text-black min-[768px]:mb-[80px] min-[768px]:text-[64px]"
          style={{ fontFamily: "var(--font-open-sans), 'Open Sans', sans-serif" }}
        >
          {settings.social_heading}
        </h1>
      </div>

      <div className="mx-auto w-full max-w-[940px] px-5">
        {!showFallback && (
          <div
            className={`elfsight-app-${ELF_SIGHT_APP_ID}`}
            data-elfsight-app-lazy
          />
        )}

        {showFallback && (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-neutral-200 bg-white px-8 py-10 text-center shadow-sm">
            <p
              className="text-lg font-semibold text-black"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              {settings.instagram_handle || "@sopheanaildesign"}
            </p>
            <p
              className="mt-2 text-sm text-neutral-600"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              Instagram feed is temporarily unavailable. Follow us for the latest
              designs.
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              Open Instagram
            </a>
          </div>
        )}
      </div>

      {!showFallback && patchReady && (
        <Script
          src="https://static.elfsight.com/platform/platform.js"
          strategy="lazyOnload"
        />
      )}
    </section>
  );
}
