import { chromium } from "playwright";

const BASE = "http://localhost:3260";
const browser = await chromium.launch();

async function measureRoute(route, label) {
  const page = await browser.newPage();
  const jsRequests = [];
  let threeJsLoaded = false;

  page.on("response", async (res) => {
    const url = res.url();
    if (url.endsWith(".js") && res.status() === 200) {
      jsRequests.push(url);
      try {
        const body = await res.text();
        if (body.includes("react-three-fiber") || body.includes("THREE.Vector3")) {
          threeJsLoaded = true;
        }
      } catch {}
    }
  });

  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  console.log(`\n=== ${label} (${route}) ===`);
  console.log(`  JS requests: ${jsRequests.length}`);
  console.log(`  Three.js loaded on page load: ${threeJsLoaded}`);
  await page.close();
  return { jsRequests: jsRequests.length, threeJsLoaded };
}

// Pages that should NEVER load Three.js
await measureRoute("/about", "About (no artifacts)");
await measureRoute("/docs", "Docs (no artifacts)");
await measureRoute("/collections", "Collections (no artifacts)");
await measureRoute("/artifacts/magnetic-button", "Magnetic Button (DOM/CSS artifact)");

// A page that SHOULD eventually load Three.js, once the canvas scrolls into view
const page = await browser.newPage();
let threeJsLoaded = false;
page.on("response", async (res) => {
  const url = res.url();
  if (url.endsWith(".js") && res.status() === 200) {
    try {
      const body = await res.text();
      if (body.includes("react-three-fiber")) threeJsLoaded = true;
    } catch {}
  }
});
await page.goto(`${BASE}/artifacts/crystal-gem`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
console.log(`\n=== Crystal Gem — immediately after page load ===`);
console.log(`  Three.js loaded yet: ${threeJsLoaded}`);
// crystal-gem's canvas is in the default "Preview" tab, should already be in viewport
await page.waitForTimeout(1500);
console.log(`=== Crystal Gem — after settling (canvas should be visible) ===`);
console.log(`  Three.js loaded: ${threeJsLoaded}`);
const canvasCount = await page.locator("canvas").count();
console.log(`  canvas rendered: ${canvasCount > 0}`);
await page.close();

await browser.close();
