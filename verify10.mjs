import { chromium } from "playwright";

const BASE = "http://localhost:3220";
const browser = await chromium.launch();
const context = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();

// 1) Server-side restore: load magnetic-button with a query string directly (no interaction)
await page.goto(`${BASE}/artifacts/magnetic-button?strength=0.9&color=FF00AA&glow=true&easing=linear`, { waitUntil: "networkidle" });
await page.getByRole("tab", { name: "Customize" }).click();
await page.waitForTimeout(300);
const glowSwitch = await page.getByRole("switch", { name: "Glow" }).getAttribute("aria-checked");
const colorInput = await page.locator('input[type="color"]').first().inputValue();
console.log("=== Server-side restore from URL ===");
console.log("  glow restored true:", glowSwitch === "true");
console.log("  color restored:", colorInput, colorInput.toLowerCase() === "#ff00aa");

// 2) Live customize -> URL sync
await page.goto(`${BASE}/artifacts/aurora-globe`, { waitUntil: "networkidle" });
await page.getByRole("tab", { name: "Customize" }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: "Cosmic", exact: true }).click();
await page.waitForTimeout(300);
const urlAfterPreset = page.url();
console.log("\n=== Live URL sync after applying Cosmic preset ===");
console.log("  url:", urlAfterPreset);
console.log("  contains speed=0.22:", urlAfterPreset.includes("speed=0.22"));
console.log("  contains colorA=E06BD6:", urlAfterPreset.toUpperCase().includes("COLORA=E06BD6"));

// 3) Share Configuration copies the exact current URL
await page.getByRole("button", { name: /Share configuration/ }).click();
await page.waitForTimeout(200);
const clipboardUrl = await page.evaluate(() => navigator.clipboard.readText());
console.log("\n=== Share Configuration ===");
console.log("  clipboard matches address bar:", clipboardUrl === urlAfterPreset);

// 4) Reload from that exact shared URL and confirm the preview restores (check select's value in URL persists after reload)
await page.goto(clipboardUrl, { waitUntil: "networkidle" });
await page.getByRole("tab", { name: "Customize" }).click();
await page.waitForTimeout(300);
const urlAfterReload = page.url();
console.log("\n=== Reload from shared URL ===");
console.log("  url preserved:", urlAfterReload === urlAfterPreset);

await browser.close();
