import Script from "next/script";
import type { SiteSettings } from "@/lib/api";

/**
 * Literal reproduction of sopheanaildesign.webflow.io's Instagram section:
 *
 *  <section class="section"><div class="div-block"><h1 class="heading-29">...</h1></div>
 *  <div class="w-layout-blockcontainer w-container">
 *    <div class="html-embed w-embed w-script">
 *      <script src="https://apps.elfsight.com/p/platform.js" defer></script>
 *      <div class="elfsight-app-6977d479-4143-42d0-bcb8-2d139541316a"></div>
 *    </div>
 *  </div></section>
 *
 *  .section     { padding: 100px 0; }
 *  .div-block   { width: 80%; max-width: 1200px; margin: 0 auto; }
 *  .heading-29  { width: 80%; max-width: 1151.19px; margin: 0 auto 40px;
 *                 font-family: Open Sans, sans-serif; font-size: 4rem (>=768px) / 2rem (<768px);
 *                 line-height: 100%; } -- still uppercase/bold/-1.5px tracking from the base h1 rule.
 *
 * The profile card, post grid, hover like/comment overlay, right-arrow
 * pagination and click-to-expand lightbox are ALL rendered live by the
 * embedded Elfsight Instagram Feed widget itself (same widget/app id as the
 * source site) — not hand-built, so behaviour matches the reference 1:1.
 */
export function InstagramSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-[60px] min-[768px]:py-[100px]">
      <div className="mx-auto w-[80%] max-w-[1200px]">
        <h1
          className="mx-auto mb-10 w-[80%] max-w-[1151px] text-center text-[32px] font-bold uppercase leading-none tracking-[-1.5px] text-black min-[768px]:text-[64px]"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {settings.social_heading}
        </h1>
      </div>

      <div className="mx-auto w-full max-w-[940px] px-5">
        <div className="elfsight-app-6977d479-4143-42d0-bcb8-2d139541316a" />
      </div>
      <Script src="https://apps.elfsight.com/p/platform.js" strategy="lazyOnload" />
    </section>
  );
}
