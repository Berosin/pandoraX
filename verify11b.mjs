import { chromium, devices } from "playwright";

const BASE = "http://localhost:3231";
const browser = await chromium.launch();
const page = await browser.newPage();

// Customize panel + preset real-value check on crystal-gem
await page.goto(`${BASE}/artifacts/crystal-gem`, { waitUntil: "networkidle" });
await page.getByRole("tab", { name: "Customize" }).click();
await page.waitForTimeout(300);
const metalnessBefore = await page.locator("span.font-mono").nth(1).innerText();
await page.getByRole("button", { name: "Gold", exact: true }).click();
await page.waitForTimeout(200);
const metalnessAfter = await page.locator("span.font-mono").nth(1).innerText();
console.log("=== crystal-gem preset ===");
console.log("  metalness before/after Gold preset:", metalnessBefore, "->", metalnessAfter);

// Metadata badges check
await page.goto(`${BASE}/artifacts/particle-field`, { waitUntil: "networkidle" });
const bodyText = await page.locator("body").innerText();
console.log("\n=== particle-field metadata badges ===");
console.log("  GPU intensive:", bodyText.includes("GPU intensive"));
console.log("  WebGL required:", bodyText.includes("WebGL required"));
console.log("  Mobile reduced:", bodyText.toLowerCase().includes("reduced detail"));

await browser.close();
