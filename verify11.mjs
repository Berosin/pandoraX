import { chromium, devices } from "playwright";

const BASE = "http://localhost:3230";
const browser = await chromium.launch();

const slugs = ["crystal-gem", "particle-field", "shader-backdrop", "ripple-scene", "threejs-environment"];

// 1) Desktop: load each artifact page, collect console errors, check canvas exists
{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console] ${msg.text()}`);
  });

  for (const slug of slugs) {
    errors.length = 0;
    await page.goto(`${BASE}/artifacts/${slug}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const canvasCount = await page.locator("canvas").count();
    console.log(`\n=== ${slug} (desktop) ===`);
    console.log("  canvas present:", canvasCount > 0, `(count: ${canvasCount})`);
    console.log("  console/page errors:", errors.length === 0 ? "none" : errors);
  }
  await page.close();
}

// 2) Mobile emulation: confirm pages still render without errors, and check for a canvas
{
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

  for (const slug of slugs) {
    errors.length = 0;
    await page.goto(`${BASE}/artifacts/${slug}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const canvasCount = await page.locator("canvas").count();
    console.log(`\n=== ${slug} (mobile emulation) ===`);
    console.log("  canvas present:", canvasCount > 0, `(count: ${canvasCount})`);
    console.log("  errors:", errors.length === 0 ? "none" : errors);
  }
  await context.close();
}

await browser.close();
