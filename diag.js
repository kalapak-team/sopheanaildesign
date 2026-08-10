const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
  const info = await page.evaluate(() => {
    const el = document.getElementById("home");
    if (!el) return { error: "no #home" };
    const cs = getComputedStyle(el);
    return {
      height: cs.height,
      inlineStyle: el.getAttribute("style"),
      display: cs.display,
      flexDirection: cs.flexDirection,
      offsetHeight: el.offsetHeight,
      childCount: el.children.length,
      childrenTags: Array.from(el.children).map((c) => c.tagName + "." + c.className),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
