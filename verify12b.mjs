import { chromium } from "playwright";

const BASE = "http://localhost:3261";
const browser = await chromium.launch();
const page = await browser.newPage();
let threeJsLoadCount = 0;
page.on("response", async (res) => {
  const url = res.url();
  if (url.endsWith(".js") && res.status() === 200) {
    try {
      const body = await res.text();
      if (body.includes("react-three-fiber")) threeJsLoadCount++;
    } catch {}
  }
});

// Load the gallery page — don't scroll yet
await page.goto(`${BASE}/artifacts`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
console.log("=== Gallery page: Three.js chunk fetches before any scroll ===", threeJsLoadCount);

// Now scroll all the way down to bring every card into view
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2000);
console.log("=== Gallery page: Three.js chunk fetches after scrolling through all cards ===", threeJsLoadCount);

await browser.close();
